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

  bot.on('message', (payload, reply, actions) => {
    t.type(payload, 'object', 'payload should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
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

  bot.on('message', (payload, reply, actions) => {
    t.type(payload, 'object', 'payload should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
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

tap.test('POST webhook with incorrect signature', (t) => {
  let bot = new Bot({
    token: 'foo',
    app_secret: 'e6af24be1d683c8c911949f897eea1f6'
  })

  bot.on('error', (err) => {
    t.equals(err.message, 'Message integrity check failed', 'correct error should be thrown')
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature': 'sha1=DONEZO'
      },
      body: '{"object":"page","entry":[{"id":1751036168465324,"time":1460923697656,"messaging":[{"sender":{"id":982337261802700},"recipient":{"id":1751036168465324},"timestamp":1460923697635,"message":{"mid":"mid.1460923697625:5c96e8279b55505308","seq":614,"text":"Test \\u00e4\\u00eb\\u00ef"}}]}]}'
    }, (err, res, body) => {
      t.error(err, 'response should not error')
      t.equals(res.statusCode, 200, 'request should return 200 status code')
      t.deepEquals(JSON.parse(body), { status: 'not ok', error: 'Message integrity check failed' }, 'response should return error')
      t.end()
    })
  })

  t.tearDown(() => {
    server.close()
  })
})

tap.test('POST webhook with echo', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('echo', (payload, reply, actions) => {
    t.type(payload, 'object', 'payload should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
    t.equals(payload.message.text, 'Test äëï', 'correct echo text was sent')
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"object":"page","entry":[{"id":1751036168465324,"time":1460923697656,"messaging":[{"sender":{"id":"251415921884267"},"recipient":{"id":961373540645425},"timestamp":1474195344285,"message":{"is_echo":true,"app_id":518384185035814,"mid":"mid.1474195344232:c667d9bc3076277d14","seq":6546,"text":"Test \\u00e4\\u00eb\\u00ef"}}]}]}'
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

tap.test('POST webhook with postback', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('postback', (payload, reply, actions) => {
    t.type(payload, 'object', 'payload should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
    t.equals(payload.postback.payload, 'Test äëï', 'correct postback payload was sent')
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"object":"page","entry":[{"id":1751036168465324,"time":1460923697656,"messaging":[{"sender":{"id":982337261802700},"recipient":{"id":1751036168465324},"timestamp":1460923697635,"postback":{"payload":"Test \\u00e4\\u00eb\\u00ef"}}]}]}'
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

tap.test('POST webhook with delivery receipt', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('postback', (payload, reply, actions) => {
    t.type(payload, 'object', 'payload should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
    t.equals(payload.delivery.watermark, '1460923697635', 'correct delivery receipt watermark was sent')
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"object":"page","entry":[{"id":1751036168465324,"time":1460923697656,"messaging":[{"sender":{"id":982337261802700},"recipient":{"id":1751036168465324},"timestamp":1460923697635,"delivery":{"mid":"mid.1460923697625:5c96e8279b55505308","seq":614, "watermark": 1460923697635}}]}]}'
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

tap.test('POST webhook with authentication callback', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('authentication', (payload, reply, actions) => {
    t.type(payload, 'object', 'authentication should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
    t.equals(payload.optin.ref, 'bar', 'correct data ref was sent')
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"object":"page","entry":[{"id":510249619162304,"time":1461167227231,"messaging":[{"sender":{"id":1066835436691078},"recipient":{"id":510249619162304},"timestamp":1461167227231,"optin":{"ref":"bar"}}]}]}'
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

tap.test('POST webhook with read callback', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('read', (payload, reply, actions) => {
    t.type(payload, 'object', 'authentication should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
    t.equals(payload.read.watermark, 1461167227231, 'correct message watermark was sent')
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"object":"page","entry":[{"id":510249619162304,"time":1461167227231,"messaging":[{"sender":{"id":1066835436691078},"recipient":{"id":510249619162304},"timestamp":1461167227231,"read":{"watermark":1461167227231}}]}]}'
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

tap.test('POST webhook with account_linking (linked) callback', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('accountLinked', (payload, reply, actions) => {
    t.type(payload, 'object', 'authentication should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
    t.equals(payload.account_linking.status, 'linked', 'correct linking status was sent')
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"object":"page","entry":[{"id":510249619162304,"time":1461167227231,"messaging":[{"sender":{"id":1066835436691078},"recipient":{"id":510249619162304},"timestamp":1461167227231,"account_linking":{"status":"linked"}}]}]}'
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

tap.test('POST webhook with account_linking (unlinked) callback', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  bot.on('accountUnlinked', (payload, reply, actions) => {
    t.type(payload, 'object', 'authentication should be an object')
    t.type(reply, 'function', 'reply convenience function should exist')
    t.type(actions, 'object', 'actions should be an object')
    t.equals(payload.account_linking.status, 'unlinked', 'correct linking status was sent')
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"object":"page","entry":[{"id":510249619162304,"time":1461167227231,"messaging":[{"sender":{"id":1066835436691078},"recipient":{"id":510249619162304},"timestamp":1461167227231,"account_linking":{"status":"unlinked"}}]}]}'
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
