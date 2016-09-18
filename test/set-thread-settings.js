'use strict'
const tap = require('tap')
const nock = require('nock')
const Bot = require('../')

tap.test('set thread settings - get started button - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    setting_type: 'call_to_actions',
    thread_state: 'new_thread',
    call_to_actions: [
      {
        payloay: 'USER_DEFINED_PAYLOAD'
      }
    ]
  }

  let response = {
    result: 'Successfully added new_thread\'s CTAs'
  }

  nock('https://graph.facebook.com')
    .post('/v2.6/me/thread_settings', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  let getStartedPayload = [
    {
      payloay: 'USER_DEFINED_PAYLOAD'
    }
  ]

  bot.setGetStartedButton(getStartedPayload, (err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  })
})

tap.test('set thread settings - persistent menu - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    setting_type: 'call_to_actions',
    thread_state: 'existing_thread',
    call_to_actions: [
      {
        'type': 'postback',
        'title': 'My simple postback',
        'payload': 'myPostback'
      }
    ]
  }

  let response = {
    result: 'Successfully added structured menu CTAs'
  }

  nock('https://graph.facebook.com')
    .post('/v2.6/me/thread_settings', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  let menuPayload = [
    {
      'type': 'postback',
      'title': 'My simple postback',
      'payload': 'myPostback'
    }
  ]

  bot.setPersistentMenu(menuPayload, (err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  })
})
