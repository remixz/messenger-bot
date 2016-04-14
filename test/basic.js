'use strict'
const tap = require('tap')
const http = require('http')
const request = require('request')
const Bot = require('../')

let bot = new Bot({
  token: 'foo'
})

tap.test('basic initialization', (t) => {
  t.plan(8)

  t.type(bot, 'object', 'bot class is initiated correctly')
  t.equals(bot.token, 'foo', 'bot token is stored correctly')
  t.type(bot.middleware, 'function', 'bot.middleware is a function')
  t.type(bot.middleware(), 'function', 'bot.middleware returns a function')
  t.type(bot.verify, 'function', 'bot.verify is a function')
  t.type(bot.verify('foo'), 'function', 'bot.verify returns a function')
  t.type(bot.sendMessage, 'function', 'bot.sendMessage is a function')
  t.type(bot.getProfile, 'function', 'bot.getProfile is a function')

  t.end()
})

tap.test('middleware runs', (t) => {
  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request.get(`http://localhost:${address.port}/_status`, (err, res, body) => {
      t.error(err, 'should not error')

      t.deepEquals(JSON.parse(body), { status: 'ok' }, 'status endpoint should return ok')

      t.tearDown(() => {
        server.close()
      })
      t.end()
    })
  })
})
