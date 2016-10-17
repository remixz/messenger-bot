# Changelog

## 2.4.0

Added support for new Messenger Platform features (#26). This includes:
  * `bot.setGetStartedButton`
  * `bot.setPersistentMenu`
  * `bot.sendSenderAction`

See the README for full documentation.

## 2.0.0

* [BREAKING] Removed `bot.verify()` middleware. Instead, specify the option `verify` when creating the bot instance, and the middleware will be automatically set up. Example:
```js
let bot = new Bot({
  token: 'PAGE_TOKEN',
  verify: 'VERIFY_TOKEN'
})
```
* [BREAKING] Added `error` event to bot instance. This will require you to create a `bot.on('error')` handler, otherwise Node will throw the error instead.
* Add message integrity checking. Specify your app's secret as `app_secret` in the options of the bot instance. You can find this on your Facebook app's dashboard.
* Add testing for all functions.
