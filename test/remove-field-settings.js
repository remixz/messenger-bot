'use strict'
const tap = require('tap')
const nock = require('nock')
const Bot = require('../')

tap.test('remove field settings - get started button - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    fields: ['get_started']
  }

  let response = {
    result: 'Successfully deleted get started button'
  }

  nock('https://graph.facebook.com')
    .delete('/v2.12/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  return bot.removeGetStartedButton((err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  }).catch(t.threw)
})

tap.test('remove field settings - persistent menu - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    fields: ['persistent_menu']
  }

  let response = {
    result: 'Successfully deleted persistent menu'
  }

  nock('https://graph.facebook.com')
    .delete('/v2.12/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  return bot.removePersistentMenu((err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  }).catch(t.threw)
})

tap.test('remove field settings - domain whitelist - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    fields: ['whitelisted_domains']
  }

  let response = {
    result: 'Successfully deleted persistent menu'
  }

  nock('https://graph.facebook.com')
    .delete('/v2.12/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  return bot.removeDomainWhitelist((err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  }).catch(t.threw)
})

tap.test('remove field settings - greeting text - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    fields: ['greeting']
  }

  let response = {
    result: 'Successfully deleted persistent menu'
  }

  nock('https://graph.facebook.com')
    .delete('/v2.12/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  return bot.removeGreeting((err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  }).catch(t.threw)
})
