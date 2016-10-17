'use strict'
const tap = require('tap')
const http = require('http')
const request = require('request')
const nock = require('nock')
const Bot = require('../')

tap.test('actions.setTyping(true)', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    recipient: {
      id: 982337261802700
    },
    sender_action: 'typing_on'
  }

  let response = {
    recipient_id: 982337261802700
  }

  nock('https://graph.facebook.com')
    .post('/v2.6/me/messages', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('message', (payload, reply, actions) => {
    t.type(payload, 'object', 'payload should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
    t.equals(payload.message.text, 'Test äëï', 'correct message was sent')

    actions.setTyping(true, (err, profile) => {
      t.error(err, 'response should not be error')
      t.deepEquals(profile, response, 'response is correct')
      t.end()
    })
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"object":"page","entry":[{"id":1751036168465324,"time":1460923697656,"messaging":[{"sender":{"id":982337261802700},"recipient":{"id":1751036168465324},"timestamp":1460923697635,"message":{"mid":"mid.1460923697625:5c96e8279b55505308","seq":614,"text":"Test \\u00e4\\u00eb\\u00ef"}}]}]}'
    }, (err, res, body) => {
      t.error(err, 'response should not error')
      t.equals(res.statusCode, 200, 'request should return status code 200')
      t.deepEquals(JSON.parse(body), { status: 'ok' }, 'response should be okay')
    })
  })

  t.tearDown(() => {
    server.close()
  })
})

tap.test('actions.setTyping(false)', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    recipient: {
      id: 982337261802700
    },
    sender_action: 'typing_off'
  }

  let response = {
    recipient_id: 982337261802700
  }

  nock('https://graph.facebook.com')
    .post('/v2.6/me/messages', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('message', (payload, reply, actions) => {
    t.type(payload, 'object', 'payload should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
    t.equals(payload.message.text, 'Test äëï', 'correct message was sent')

    actions.setTyping(false, (err, profile) => {
      t.error(err, 'response should not be error')
      t.deepEquals(profile, response, 'response is correct')
      t.end()
    })
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"object":"page","entry":[{"id":1751036168465324,"time":1460923697656,"messaging":[{"sender":{"id":982337261802700},"recipient":{"id":1751036168465324},"timestamp":1460923697635,"message":{"mid":"mid.1460923697625:5c96e8279b55505308","seq":614,"text":"Test \\u00e4\\u00eb\\u00ef"}}]}]}'
    }, (err, res, body) => {
      t.error(err, 'response should not error')
      t.equals(res.statusCode, 200, 'request should return status code 200')
      t.deepEquals(JSON.parse(body), { status: 'ok' }, 'response should be okay')
    })
  })

  t.tearDown(() => {
    server.close()
  })
})

tap.test('actions.markRead()', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    recipient: {
      id: 982337261802700
    },
    sender_action: 'mark_seen'
  }

  let response = {
    recipient_id: 982337261802700
  }

  nock('https://graph.facebook.com')
    .post('/v2.6/me/messages', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('message', (payload, reply, actions) => {
    t.type(payload, 'object', 'payload should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
    t.equals(payload.message.text, 'Test äëï', 'correct message was sent')

    actions.markRead((err, profile) => {
      t.error(err, 'response should not be error')
      t.deepEquals(profile, response, 'response is correct')
      t.end()
    })
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"object":"page","entry":[{"id":1751036168465324,"time":1460923697656,"messaging":[{"sender":{"id":982337261802700},"recipient":{"id":1751036168465324},"timestamp":1460923697635,"message":{"mid":"mid.1460923697625:5c96e8279b55505308","seq":614,"text":"Test \\u00e4\\u00eb\\u00ef"}}]}]}'
    }, (err, res, body) => {
      t.error(err, 'response should not error')
      t.equals(res.statusCode, 200, 'request should return status code 200')
      t.deepEquals(JSON.parse(body), { status: 'ok' }, 'response should be okay')
    })
  })

  t.tearDown(() => {
    server.close()
  })
})
