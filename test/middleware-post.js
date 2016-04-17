'use strict'
const tap = require('tap')
const http = require('http')
const request = require('request')
const Bot = require('../')

tap.test('POST webhook with no signature check', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('message', (payload, reply) => {
    t.type(payload, 'object', 'payload should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.equals(payload.message.text, 'Test äëï', 'correct message was sent')
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
      t.end()
    })
  })

  t.tearDown(() => {
    server.close()
  })
})

tap.test('POST webhook with signature check', (t) => {
  let bot = new Bot({
    token: 'foo',
    app_secret: 'e6af24be1d683c8c911949f897eea1f6'
  })

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('message', (payload, reply) => {
    t.type(payload, 'object', 'payload should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.equals(payload.message.text, 'Test äëï', 'correct message was sent')
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature': 'sha1=f1a4569dcf02a9829a15696d949b386b7d6d0272'
      },
      body: '{"object":"page","entry":[{"id":1751036168465324,"time":1460923697656,"messaging":[{"sender":{"id":982337261802700},"recipient":{"id":1751036168465324},"timestamp":1460923697635,"message":{"mid":"mid.1460923697625:5c96e8279b55505308","seq":614,"text":"Test \\u00e4\\u00eb\\u00ef"}}]}]}'
    }, (err, res, body) => {
      t.error(err, 'response should not error')
      t.equals(res.statusCode, 200, 'request should return 200 status code')
      t.deepEquals(JSON.parse(body), { status: 'ok' }, 'response should be okay')
      t.end()
    })
  })

  t.tearDown(() => {
    server.close()
  })
})
