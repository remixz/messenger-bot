'use strict'
const url = require('url')
const qs = require('querystring')
const EventEmitter = require('events').EventEmitter
const request = require('request-promise')
const crypto = require('crypto')

class Bot extends EventEmitter {
  constructor (opts) {
    super()

    opts = opts || {}
    if (!opts.token) {
      throw new Error('Missing page token. See FB documentation for details: https://developers.facebook.com/docs/messenger-platform/quickstart')
    }
    this.token = opts.token
    this.app_secret = opts.app_secret || false
    this.verify_token = opts.verify || false
    this.debug = opts.debug || false
  }

  getProfile (id, cb) {
    return request({
      method: 'GET',
      uri: `https://graph.facebook.com/v2.6/${id}`,
      qs: this._getQs({fields: 'first_name,last_name,profile_pic,locale,timezone,gender'}),
      json: true
    })
    .then(body => {
      if (body.error) return Promise.reject(body.error)
      if (!cb) return body
      cb(null, body)
    })
    .catch(err => {
      if (!cb) return Promise.reject(err)
      cb(err)
    })
  }

  sendMessage (recipient, payload, cb) {
    return request({
      method: 'POST',
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: this._getQs(),
      json: {
        recipient: { id: recipient },
        message: payload
      }
    })
    .then(body => {
      if (body.error) return Promise.reject(body.error)
      if (!cb) return body
      cb(null, body)
    })
    .catch(err => {
      if (!cb) return Promise.reject(err)
      cb(err)
    })
  }

  sendSenderAction (recipient, senderAction, cb) {
    return request({
      method: 'POST',
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: this._getQs(),
      json: {
        recipient: {
          id: recipient
        },
        sender_action: senderAction
      }
    })
    .then(body => {
      if (body.error) return Promise.reject(body.error)
      if (!cb) return body
      cb(null, body)
    })
    .catch(err => {
      if (!cb) return Promise.reject(err)
      cb(err)
    })
  }

  setThreadSettings (threadState, callToActions, cb) {
    return request({
      method: 'POST',
      uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
      qs: this._getQs(),
      json: {
        setting_type: 'call_to_actions',
        thread_state: threadState,
        call_to_actions: callToActions
      }
    })
    .then(body => {
      if (body.error) return Promise.reject(body.error)
      if (!cb) return body
      cb(null, body)
    })
    .catch(err => {
      if (!cb) return Promise.reject(err)
      cb(err)
    })
  }

  removeThreadSettings (threadState, cb) {
    return request({
      method: 'DELETE',
      uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
      qs: this._getQs(),
      json: {
        setting_type: 'call_to_actions',
        thread_state: threadState
      }
    })
    .then(body => {
      if (body.error) return Promise.reject(body.error)
      if (!cb) return body
      cb(null, body)
    })
    .catch(err => {
      if (!cb) return Promise.reject(err)
      cb(err)
    })
  }

  setGetStartedButton (payload, cb) {
    return this.setThreadSettings('new_thread', payload, cb)
  }

  setPersistentMenu (payload, cb) {
    return this.setThreadSettings('existing_thread', payload, cb)
  }

  removeGetStartedButton (cb) {
    return this.removeThreadSettings('new_thread', cb)
  }

  removePersistentMenu (cb) {
    return this.removeThreadSettings('existing_thread', cb)
  }

  middleware () {
    return (req, res) => {
      // we always write 200, otherwise facebook will keep retrying the request
      res.writeHead(200, { 'Content-Type': 'application/json' })
      if (req.url === '/_status') return res.end(JSON.stringify({status: 'ok'}))
      if (this.verify_token && req.method === 'GET') return this._verify(req, res)
      if (req.method !== 'POST') return res.end()

      let body = ''

      req.on('data', (chunk) => {
        body += chunk
      })

      req.on('end', () => {
        // check message integrity
        if (this.app_secret) {
          let hmac = crypto.createHmac('sha1', this.app_secret)
          hmac.update(body)

          if (req.headers['x-hub-signature'] !== `sha1=${hmac.digest('hex')}`) {
            this.emit('error', new Error('Message integrity check failed'))
            return res.end(JSON.stringify({status: 'not ok', error: 'Message integrity check failed'}))
          }
        }

        let parsed = JSON.parse(body)
        this._handleMessage(parsed)

        res.end(JSON.stringify({status: 'ok'}))
      })
    }
  }

  _getQs (qs) {
    if (typeof qs === 'undefined') {
      qs = {}
    }
    qs['access_token'] = this.token

    if (this.debug) {
      qs['debug'] = this.debug
    }

    return qs
  }

  _handleMessage (json) {
    let entries = json.entry

    entries.forEach((entry) => {
      let events = entry.messaging

      events.forEach((event) => {
        // handle inbound messages and echos
        if (event.message) {
          if (event.message.is_echo) {
            this._handleEvent('echo', event)
          } else {
            this._handleEvent('message', event)
          }
        }

        // handle postbacks
        if (event.postback) {
          this._handleEvent('postback', event)
        }

        // handle message delivered
        if (event.delivery) {
          this._handleEvent('delivery', event)
        }

        // handle message read
        if (event.read) {
          this._handleEvent('read', event)
        }

        // handle authentication
        if (event.optin) {
          this._handleEvent('authentication', event)
        }

        // handle referrals (e.g. m.me links)
        if (event.referral) {
          this._handleEvent('referral', event)
        }

        // handle account_linking
        if (event.account_linking && event.account_linking.status) {
          if (event.account_linking.status === 'linked') {
            this._handleEvent('accountLinked', event)
          } else if (event.account_linking.status === 'unlinked') {
            this._handleEvent('accountUnlinked', event)
          }
        }
      })
    })
  }

  _getActionsObject (event) {
    return {
      setTyping: (typingState, cb) => {
        let senderTypingAction = typingState ? 'typing_on' : 'typing_off'
        this.sendSenderAction(event.sender.id, senderTypingAction, cb)
      },
      markRead: this.sendSenderAction.bind(this, event.sender.id, 'mark_seen')
    }
  }

  _verify (req, res) {
    let query = qs.parse(url.parse(req.url).query)

    if (query['hub.verify_token'] === this.verify_token) {
      return res.end(query['hub.challenge'])
    }

    return res.end('Error, wrong validation token')
  }

  _handleEvent (type, event) {
    this.emit(type, event, this.sendMessage.bind(this, event.sender.id), this._getActionsObject(event))
  }
}

module.exports = Bot
