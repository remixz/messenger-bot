# Recognize Song Bot

An example bot for recognizing songs from an audio message.

<img src="https://s3.amazonaws.com/f.cl.ly/items/3x1b0o062v0u121e403q/FullSizeRender%25202.jpg?v=7d82a13c" width=450>

## Setup

* Set up your Facebook Page and App. See Facebook's instructions in step 1: https://developers.facebook.com/docs/messenger-platform/quickstart
* Sign up for the free trial on ACR Cloud: https://console.acrcloud.com/signup
* Go to https://ap-console.acrcloud.com/service/avr, and choose "Create Project". Give it whatever name you want, choose "Recorded Audio" for the audio source, make sure to choose the "ACRCloud Music" bucket by clicking on it, and enable "Enable 3rd Party ID Integration (Only available for ACRCloud Music bucket)".
* Replace `ACR_ACCESS_KEY` in `index.js` with the access key for your project, `ACR_ACCESS_SECRET` with the secret, and `ACR_HOST` with the host. As well, replace `FB_TOKEN` with your page access token, and enter any string into `FB_VERIFY` for verification later.
* Install `localtunnel` with `npm install -g localtunnel`.
* Start the bot by running `node index.js`, and in another console, run `lt --port 3000`. This will give you a localtunnel URL, that'll let Facebook access your bot from your computer.
* Set up your webhook, as seen in step 2 of https://developers.facebook.com/docs/messenger-platform/quickstart. Put the localtunnel URL in for the URL, and the same string you put in `FB_VERIFY` for the verify token.
* Make sure you've subscribed your app to your page, as seen in steps 3 and 4 of https://developers.facebook.com/docs/messenger-platform/quickstart, and send your bot an audio message from your phone's Messenger app. In a few seconds, it should return the song!
