'use strict'
const tap = require('tap')
const nock = require('nock')
const Bot = require('../')

tap.test('set field settings - get started button - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let payload = {
    "get_started": {"payload":'USER_DEFINED_PAYLOAD'}
  }

  let response = {
    result: 'Successfully added get started button'
  }

  nock('https://graph.facebook.com')
    .post('/v2.6/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  let getStartedPayload = {"payload":'USER_DEFINED_PAYLOAD'};

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
    "persistent_menu": [
      {
        "locale":"default",
        "composer_input_disabled":false,
        "call_to_actions":[
           {
            "title":"Menu",
            "type":"nested",
            "call_to_actions":[
                {
                  "type":"postback",
                  "title":"Example",
                  "payload":'USER_DEFINED_PAYLOAD'
                }
            ]
          }
        ]
      }
    ]
  }

  let response = {
    result: 'Successfully added persistent menu'
  }

  nock('https://graph.facebook.com')
    .post('/v2.6/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  let persistentMenuPayload = [
    {
      "locale":"default",
      "composer_input_disabled":false,
      "call_to_actions":[
         {
          "title":"Menu",
          "type":"nested",
          "call_to_actions":[
              {
                "type":"postback",
                "title":"Example",
                "payload":'USER_DEFINED_PAYLOAD'
              }
          ]
        }
      ]
    }
  ]

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

  let payload =  {
    "whitelisted_domains": ["https://www.example.com"]
  }

  let response = {
    result: 'Successfully added domain whitelist'
  }

  nock('https://graph.facebook.com')
    .post('/v2.6/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  let domainWhitelistPayload = ["https://www.example.com"]

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

  let payload =  {
    "greeting": [
      {
        "locale":"default",
        "text":"Hello!"
      }, {
        "locale":"en_US",
        "text":"Howdy!"
      }
    ]
  }

  let response = {
    result: 'Successfully added greeting'
  }

  nock('https://graph.facebook.com')
    .post('/v2.6/me/messenger_profile', payload)
    .query({
      access_token: 'foo'
    })
    .reply(200, response)

  let greetingPayload = [
    {
      "locale":"default",
      "text":"Hello!"
    }, {
      "locale":"en_US",
      "text":"Howdy!"
    }
  ]

  return bot.setGreeting(greetingPayload, (err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  }).catch(t.threw)
})