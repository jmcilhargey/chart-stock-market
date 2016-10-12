"use strict"

require("../env");

const crypto = require("crypto");
const fs = require("fs");

module.exports = function(baseUrl, httpMethod, nonce) {

  var format = ".json?";
  var timestamp = Math.floor(new Date() / 1000);

  var auth = {
    "oauth_consumer_key": process.env.TWITTER_KEY,
    "oauth_nonce": nonce,
    "oauth_signature_method": "HMAC-SHA1",
    "oauth_timestamp": timestamp,
    "oauth_token": process.env.TWITTER_OAUTH_TOKEN,
    "oauth_version": "1.0",
    "track": "trump"
  };

  var authString = Object.keys(auth).sort().map((key) => `${ key }=${ auth[key] }`).join("&");
  var signatureBase = `${ httpMethod }&${ encodeURIComponent(baseUrl) }&` + encodeURIComponent(`${ authString }`);
  var signingKey =  `${ encodeURIComponent(process.env.TWITTER_SECRET) }&${ encodeURIComponent(process.env.TWITTER_OAUTH_SECRET) }`

  const hmac = crypto.createHmac("sha1", signingKey);
  hmac.update(signatureBase);

  return hmac.digest("base64");
};
