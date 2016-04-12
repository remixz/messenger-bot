# messenger-bot

A Node client for the [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform). *Note: Still a WIP! Fully functional, but needs some proper testing.*

Requires Node >=4.0.0.

## Installation

```bash
npm install messenger-bot
```

## Example

```js
const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'PAGE_TOKEN'
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
```

## Usage

### Functions

#### `let bot = new Bot(opts)`

Returns a new Bot instance.

`opts` - Object

* `token` - String: Your Page Access Token, found in your App settings. Required.

#### `bot.verify(secret)`

A middleware for verifying your bot's webhook. Returns a function.

When creating your bot, Facebook requires you to do a one-time verification with a secret string. You'll need to have the app running with this middleware when setting up your webhook. I recommend deploying a boilerplate app with something like this:

```js
const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'PAGE_TOKEN'
})

http.createServer(bot.verify('YOUR_SECRET_HERE')).listen(3000)
```

Then set up your webhook, and once it's verified, you can deploy your actual bot.

#### `bot.middleware()`

The main middleware for your bot's webhook. Returns a function. Usage:

```js
const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'PAGE_TOKEN'
})

http.createServer(bot.middleware()).listen(3000)
```

As well, it mounts `/_status`, which will return `{"status": "ok"}` if the middleware is running.

#### `bot.sendMessage(recipient, payload, callback)`

Sends a message with the `payload` to the target `recipient`, and calls the callback. See [Send API](https://developers.facebook.com/docs/messenger-platform/send-api-reference#request).

* `recipient` - Number: The Facebook ID of the intended recipient.
* `payload` - Object: The message payload. Should follow the [Send API format](https://developers.facebook.com/docs/messenger-platform/send-api-reference).
* `callback` - Function: Called with `(err, info)` once the request has completed. `err` contains an error, if any, and `info` contains the response from Facebook, usually with the new message's ID.

#### `bot.getProfile(target, callback)`

Returns profile information of the `target`, called in the `callback`. See [User Profile API](https://developers.facebook.com/docs/messenger-platform/send-api-reference#user_profile_request).

* `target` - Number: The Facebook ID of the intended target.
* `callback` - Function: Called with `(err, profile)` once the request has completed. `err` contains an error, if any, and `info` contains the response from Facebook, in this format:

```json
{
  "first_name": "Zach",
  "last_name": "Bruggeman",
  "profile_pic": "<url to profile picture>"
}
```

### Events

#### bot.on('message', (payload, reply))

Triggered when a message is sent to the bot.

* `payload` - Object: An object containing the message event's payload from Facebook. See [Facebook's documentation](https://developers.facebook.com/docs/messenger-platform/webhook-reference#received_message) for the format.
* `reply` - Function: A convenience function that calls `bot.sendMessage`, with the recipient automatically set to the message sender's Facebook ID. Example usage:

```js
bot.on('message', (payload, reply) => {
  reply({ text: 'hey!'}, (err, info) => {})
})
```

#### bot.on('postback', (payload, reply))

Triggered when a postback is triggered by the sender in Messenger.

* `payload` - Object: An object containing the postback event's payload from Facebook. See [Facebook's documentation](https://developers.facebook.com/docs/messenger-platform/webhook-reference#postback) for the format.
* `reply` - Function: A convenience function that calls `bot.sendMessage`, with the recipient automatically set to the message sender's Facebook ID. Example usage:

```js
bot.on('postback', (payload, reply) => {
  reply({ text: 'hey!'}, (err, info) => {})
})
```

#### bot.on('delivery', (payload, reply))

Triggered when a message has been successfully delivered.

* `payload` - Object: An object containing the delivery event's payload from Facebook. See [Facebook's documentation](https://developers.facebook.com/docs/messenger-platform/webhook-reference#message_delivery) for the format.
* `reply` - Function: A convenience function that calls `bot.sendMessage`, with the recipient automatically set to the message sender's Facebook ID. Example usage:

```js
bot.on('delivery', (payload, reply) => {
  reply({ text: 'hey!'}, (err, info) => {})
})
```
