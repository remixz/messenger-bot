'use strict'
const url = require('url')
const qs = require('querystring')
const EventEmitter = require('events').EventEmitter
const request = require('request')

class Bot extends EventEmitter {
  constructor (opts) {
    super()

    opts = opts || {}
    if (!opts.token) {
      throw new Error('Missing page token. See FB documentation for details: https://developers.facebook.com/docs/messenger-platform/quickstart')
    }
    this.token = opts.token
  }

  getProfile (id, cb) {
    if (!cb) cb = Function.prototype

    request({
      method: 'GET',
      uri: `https://graph.facebook.com/v2.6/${id}`,
      qs: {
        fields: 'first_name,last_name,profile_pic',
        access_token: this.token
      },
      json: true
    }, (err, res, body) => {
      if (err) return cb(err)
      if (body.error) return cb(body.error)

      cb(null, body)
    })
  }

  sendMessage (recipient, payload, cb) {
    if (!cb) cb = Function.prototype

    request({
      method: 'POST',
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {
        access_token: this.token
      },
      json: {
        recipient: { id: recipient },
        message: payload
      }
    }, (err, res, body) => {
      if (err) return cb(err)
      if (body.error) return cb(body.error)

      cb(null, body)
    })
  }

  verify (token) {
    return (req, res) => {
      if (req.method === 'GET') {
        let query = qs.parse(url.parse(req.url).query)

        if (query['hub.verify_token'] === token) {
          return res.end(query['hub.challenge'])
        }

        return res.end('Error, wrong validation token')
      }
    }
  }

  middleware () {
    return (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      if (req.url === '/_status') return res.send({status: 'ok'})
      if (req.method !== 'POST') return res.end()

      let body = ''

      req.on('data', (chunk) => {
        body += chunk
      })

      req.on('end', () => {
        let parsed = JSON.parse(body)

        let entries = parsed.entry

        entries.forEach((entry) => {
          let events = entry.messaging

          events.forEach((event) => {
            // handle inbound messages
            if (event.message) {
              this._handleEvent('message', event)
            }

            // handle postbacks
            if (event.postback) {
              this._handleEvent('postback', event)
            }

            // handle message delivered
            if (event.delivery) {
              this._handleEvent('delivery', event)
            }
          })
        })

        res.end({status: 'ok'})
      })
    }
  }

  _handleEvent (type, event) {
    this.emit(type, event, this.sendMessage.bind(this, event.sender.id))
  }
}

module.exports = Bot
