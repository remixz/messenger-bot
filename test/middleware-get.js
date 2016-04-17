'use strict'
const tap = require('tap')
const http = require('http')
const request = require('request')
const Bot = require('../')

tap.test('GET webhook with correct verify token', (t) => {
  let bot = new Bot({
    token: 'foo',
    verify: '$ecr3ts!'
  })

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'GET',
      qs: {
        'hub.verify_token': '$ecr3ts!',
        'hub.challenge': 'g0od_job!'
      }
    }, (err, res, body) => {
      t.error(err, 'response should not error')
      t.equals(res.statusCode, 200, 'request should return status code 200')
      t.equals(body, 'g0od_job!', 'response body should be hub.challenge value')
      t.end()
    })
  })

  t.tearDown(() => {
    server.close()
  })
})

tap.test('GET webhook with incorrect verify token', (t) => {
  let bot = new Bot({
    token: 'foo',
    verify: '$ecr3ts!'
  })

  bot.on('error', (err) => {
    t.error(err, 'bot instance returned error')
    t.end()
  })

  let server = http.createServer(bot.middleware()).listen(0, () => {
    let address = server.address()

    request({
      url: `http://localhost:${address.port}`,
      method: 'GET',
      qs: {
        'hub.verify_token': 'WRONG',
        'hub.challenge': 'g0od_job!'
      }
    }, (err, res, body) => {
      t.error(err, 'response should not error')
      t.equals(res.statusCode, 200, 'request should return status code 200')
      t.equals(body, 'Error, wrong validation token', 'response body returned error')
      t.end()
    })
  })

  t.tearDown(() => {
    server.close()
  })
})
