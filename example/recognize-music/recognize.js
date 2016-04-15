'use strict'
const crypto = require('crypto')
const request = require('request')

module.exports = function recognizeSong (opts, cb) {
  let attachment = opts.message.attachments[0]

  request({
    uri: attachment.payload.url,
    method: 'GET',
    encoding: null
  }, (err, res, audio) => {
    if (err) return cb(err)

    let timestamp = Date.now()
    let signingString = `POST\n/v1/identify\n${opts.key}\naudio\n1\n${timestamp}`
    let signature = crypto.createHmac('sha1', opts.secret).update(new Buffer(signingString, 'utf-8')).digest('base64')
    request({
      uri: `http://${opts.host}/v1/identify`,
      method: 'POST',
      formData: {
        access_key: opts.key,
        data_type: 'audio',
        sample_bytes: audio.length,
        sample: audio,
        signature_version: 1,
        signature: signature,
        timestamp: timestamp
      },
      json: true
    }, (err, res, body) => {
      if (err) return cb(err)

      if (body.status.code !== 0) {
        return cb({message: 'NO_MATCH'})
      }

      let song = body.metadata.music[0]
      if (song.external_metadata && song.external_metadata.spotify) {
        request({
          uri: `https://api.spotify.com/v1/tracks/${song.external_metadata.spotify.track.id}`,
          method: 'GET',
          json: true
        }, (err, res, body) => {
          if (err) return cb(err)

          return cb(null, {
            title: song.title,
            artist: song.artists[0].name,
            album_art: body.album.images[0].url,
            spotify: body.external_urls.spotify,
            youtube: (song.external_metadata.youtube ? `https://www.youtube.com/watch?v=${song.external_metadata.youtube.vid}` : null)
          })
        })
      } else {
        return cb(null, {
          title: song.title,
          artist: song.artists[0].name
        })
      }
    })
  })
}
