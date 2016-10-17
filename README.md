# messenger-bot
[![Build Status](https://travis-ci.org/remixz/messenger-bot.svg?branch=master)](https://travis-ci.org/remixz/messenger-bot)
[![Coverage Status](https://coveralls.io/repos/github/remixz/messenger-bot/badge.svg?branch=master)](https://coveralls.io/github/remixz/messenger-bot?branch=master)
[![npm version](https://img.shields.io/npm/v/messenger-bot.svg)](https://www.npmjs.com/package/messenger-bot)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)


A Node client for the [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform).

Requires Node >=4.0.0.

## Installation

```bash
npm install messenger-bot
```

## Example

See more examples in [the examples folder.](https://github.com/remixz/messenger-bot/tree/master/example)

Run this example in the cloud: [![Nitrous Quickstart](https://nitrous-image-icons.s3.amazonaws.com/quickstart.svg)](https://www.nitrous.io/quickstart)
* Setup `PAGE_TOKEN`, `VERIFY_TOKEN`, `APP_SECRET` and start the example by `Run > Start Messenger Echo Bot`.
* Your Webhook URL is available at `Preview > 3000` in the IDE.

```js
const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'PAGE_TOKEN',
  verify: 'VERIFY_TOKEN',
  app_secret: 'APP_SECRET'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

http.createServer(bot.middleware()).listen(3000)
console.log('Echo bot server running at port 3000.')
```

## Usage

### Functions

#### `let bot = new Bot(opts)`

Returns a new Bot instance.

`opts` - Object

* `token` - String: Your Page Access Token, found in your App settings. Required.
* `verify` - String: A verification token for the first-time setup of your webhook. Optional, but will be required by Facebook when you first set up your webhook.
* `app_secret` - String: Your App Secret token used for message integrity check. If specified, every POST request  will be tested for spoofing. Optional.

#### `bot.middleware()`

The main middleware for your bot's webhook. Returns a function. Usage:

```js
const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'PAGE_TOKEN',
  verify: 'VERIFY_TOKEN'
})

http.createServer(bot.middleware()).listen(3000)
```

As well, it mounts `/_status`, which will return `{"status": "ok"}` if the middleware is running. If `verify` is specified in the bot options, it will mount a handler for `GET` requests that verifies the webhook.

#### `bot.sendMessage(recipient, payload, callback)`

Sends a message with the `payload` to the target `recipient`, and calls the callback. See [Send API](https://developers.facebook.com/docs/messenger-platform/send-api-reference#request).

* `recipient` - Number: The Facebook ID of the intended recipient.
* `payload` - Object: The message payload. Should follow the [Send API format](https://developers.facebook.com/docs/messenger-platform/send-api-reference).
* `callback` - Function: Called with `(err, info)` once the request has completed. `err` contains an error, if any, and `info` contains the response from Facebook, usually with the new message's ID.

#### `bot.sendSenderAction(recipient, senderAction, callback)`

Sends the sender action `senderAction` to the target `recipient`, and calls the callback.

* `recipient` - Number: The Facebook ID of the intended recipient.
* `senderAction` - String: The sender action to execute. Can be one of: `typing_on`, 'typing_off', 'mark_seen'. See the [Send API reference](https://developers.facebook.com/docs/messenger-platform/send-api-reference) for more information.
* `callback` - Function: Called with `(err, info)` once the request has completed. `err` contains an error, if any, and `info` contains the response from Facebook, usually with the new message's ID.

#### `bot.setGetStartedButton(payload, callback)`
#### `bot.setPersistentMenu(payload, callback)`

Sets settings for the Get Started Button / Persistent Menu. See the [Thread Settings Reference](https://developers.facebook.com/docs/messenger-platform/thread-settings) `call_to_actions` sections for what to put in the `payload`.

#### `bot.removeGetStartedButton(callback)`
#### `bot.removePersistentMenu(callback)`

Removes the Get Started Button / Persistent Menu.

#### `bot.getProfile(target, callback)`

Returns profile information of the `target`, called in the `callback`. See [User Profile API](https://developers.facebook.com/docs/messenger-platform/send-api-reference#user_profile_request).

* `target` - Number: The Facebook ID of the intended target.
* `callback` - Function: Called with `(err, profile)` once the request has completed. `err` contains an error, if any, and `info` contains the response from Facebook, in this format:

```json
{
  "first_name": "Zach",
  "last_name": "Bruggeman",
  "profile_pic": "<url to profile picture>",
  "locale": "en",
  "timezone": "PST",
  "gender": "M"
}
```

#### `bot._handleMessage(payload)`

The underlying method used by `bot.middleware()` to parse the message payload, and fire the appropriate events. Use this if you've already implemented your own middleware or route handlers to receive the webhook request, and just want to fire the events on the bot instance. See [the echo bot implemented in Express](https://github.com/remixz/messenger-bot/blob/master/example/echo-express.js) for an example.

* `payload` - Object: The payload sent by Facebook to the webhook.

#### `bot._verify(req, res)`

The underlying method used by `bot.middleware()` for the initial webhook verification. Use this if you've already implemented your own middleware or route handlers, and wish to handle the request without implementing `bot.middleware()`. See [the echo bot implemented in Express](https://github.com/remixz/messenger-bot/blob/master/example/echo-express.js) for an example.

* `req` - Request: The `http` request object.
* `res` - Response: The `http` response object.

### Events

#### bot.on('message', (payload, reply, actions))

Triggered when a message is sent to the bot.

* `payload` - Object: An object containing the message event's payload from Facebook. See [Facebook's documentation](https://developers.facebook.com/docs/messenger-platform/webhook-reference#received_message) for the format.
* `reply` - Function: A convenience function that calls `bot.sendMessage`, with the recipient automatically set to the message sender's Facebook ID. Example usage:

```js
bot.on('message', (payload, reply, actions) => {
  reply({ text: 'hey!'}, (err, info) => {})
})
```

* `actions` - Object: An object with two functions: `setTyping(status: Boolean)`, and `markRead()`.

#### bot.on('postback', (payload, reply, actions))

Triggered when a postback is triggered by the sender in Messenger.

* `payload` - Object: An object containing the postback event's payload from Facebook. See [Facebook's documentation](https://developers.facebook.com/docs/messenger-platform/webhook-reference#postback) for the format.
* `reply` - Function: A convenience function that calls `bot.sendMessage`, with the recipient automatically set to the message sender's Facebook ID. Example usage:
* `actions` - Object: An object with two functions: `setTyping(status: Boolean)`, and `markRead()`.

```js
bot.on('postback', (payload, reply, actions) => {
  reply({ text: 'hey!'}, (err, info) => {})
})
```

#### bot.on('delivery', (payload, reply, actions))

Triggered when a message has been successfully delivered.

* `payload` - Object: An object containing the delivery event's payload from Facebook. See [Facebook's documentation](https://developers.facebook.com/docs/messenger-platform/webhook-reference#message_delivery) for the format.
* `reply` - Function: A convenience function that calls `bot.sendMessage`, with the recipient automatically set to the message sender's Facebook ID. Example usage:
* `actions` - Object: An object with two functions: `setTyping(status: Boolean)`, and `markRead()`.

```js
bot.on('delivery', (payload, reply, actions) => {
  reply({ text: 'hey!'}, (err, info) => {})
})
```

#### bot.on('authentication', (payload, reply, actions))

Triggered when a user authenticates with the "Send to Messenger" plugin.

* `payload` - Object: An object containing the authentication event's payload from Facebook. See [Facebook's documentation](https://developers.facebook.com/docs/messenger-platform/webhook-reference#auth) for the format.
* `reply` - Function: A convenience function that calls `bot.sendMessage`, with the recipient automatically set to the message sender's Facebook ID. Example usage:
* `actions` - Object: An object with two functions: `setTyping(status: Boolean)`, and `markRead()`.

```js
bot.on('authentication', (payload, reply, actions) => {
  reply({ text: 'thanks!'}, (err, info) => {})
})
```
