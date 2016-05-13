'use strict'
const tap = require('tap')
const nock = require('nock')
const Bot = require('../')

tap.test('bot.getProfile() - successful request', (t) => {
  let bot = new Bot({
    token: 'foo'
  })

  let response = {
    first_name: 'Cool',
    last_name: 'Kid',
    profile_pic: 'url',
    locale: 'en',
    timezone: 'PST',
    gender: 'M'
  }

  nock('https://graph.facebook.com').get('/v2.6/1').query({
    fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
    access_token: 'foo'
  }).reply(200, response)

  bot.getProfile(1, (err, profile) => {
    t.error(err, 'response should not be error')
    t.deepEquals(profile, response, 'response is correct')
    t.end()
  })
})
