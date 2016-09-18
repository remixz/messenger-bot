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
    thread_state: 'new_thread'
  }

  let response = {
    result: 'Successfully deleted all new_thread\'s CTAs'
  }

  nock('https://graph.facebook.com')
    .delete('/v2.6/me/thread_settings', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  bot.removeGetStartedButton((err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  })
})

tap.test('remove thread settings - persistent menu - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    setting_type: 'call_to_actions',
    thread_state: 'existing_thread'
  }

  let response = {
    result: 'Successfully deleted structured menu CTAs'
  }

  nock('https://graph.facebook.com')
    .delete('/v2.6/me/thread_settings', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  bot.removePersistentMenu((err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  })
})
