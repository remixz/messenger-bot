'use strict'
const tap = require('tap')
const nock = require('nock')
const Bot = require('../')

tap.test('bot.getProfile() - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    recipient: { id: 1 },
    message: { text: 'hello!' }
  }

  let response = {
    recipient_id: '1008372609250235',
    message_id: 'mid.1456970487936:c34767dfe57ee6e339'
  }

  nock('https://graph.facebook.com').post('/v2.6/me/messages', payload).query({
    access_token: 'foo'
  }).reply(200, response)

  bot.sendMessage(1, payload.message, (err, body) => {
    t.error(err, 'response should not be error')
    t.deepEquals(body, response, 'response is correct')
    t.end()
  })
})
