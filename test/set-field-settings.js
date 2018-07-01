'use strict'
const tap = require('tap')
const nock = require('nock')
const Bot = require('../')

tap.test('set field settings - get started button - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    'get_started': ['USER_DEFINED_PAYLOAD']
  }

  let response = {
    result: 'Successfully added get started button'
  }

  nock('https://graph.facebook.com')
    .post('/v2.12/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  let getStartedPayload = ['USER_DEFINED_PAYLOAD']

  return bot.setGetStartedButton(getStartedPayload, (err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  }).catch(t.threw)
})

tap.test('set field settings - persistent menu - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    'persistent_menu': ['USER_DEFINED_PAYLOAD']
  }

  let response = {
    result: 'Successfully added persistent menu'
  }

  nock('https://graph.facebook.com')
    .post('/v2.12/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  let persistentMenuPayload = ['USER_DEFINED_PAYLOAD']

  return bot.setPersistentMenu(persistentMenuPayload, (err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  }).catch(t.threw)
})

tap.test('set field settings - domain whitelist - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    'whitelisted_domains': ['USER_DEFINED_PAYLOAD']
  }

  let response = {
    result: 'Successfully added domain whitelist'
  }

  nock('https://graph.facebook.com')
    .post('/v2.12/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  let domainWhitelistPayload = ['USER_DEFINED_PAYLOAD']

  return bot.setDomainWhitelist(domainWhitelistPayload, (err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  }).catch(t.threw)
})

tap.test('set field settings - greeting - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    'greeting': ['USER_DEFINED_PAYLOAD']
  }

  let response = {
    result: 'Successfully added greeting'
  }

  nock('https://graph.facebook.com')
    .post('/v2.12/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  let greetingPayload = ['USER_DEFINED_PAYLOAD']

  return bot.setGreeting(greetingPayload, (err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  }).catch(t.threw)
})
