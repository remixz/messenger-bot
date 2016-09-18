'use strict'
const tap = require('tap')
const nock = require('nock')
const Bot = require('../')

tap.test('actions set typing - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    recipient: {
      id: 1
    },
    sender_action: 'typing_on'
  }

  let response = {
    recipient_id: '1'
  }

  nock('https://graph.facebook.com')
    .post('/v2.6/me/messages', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  bot.sendSenderAction(1, 'typing_on', (err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  })
})
