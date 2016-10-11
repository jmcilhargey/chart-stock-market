"use strict"

require("../env");

const crypto = require("crypto");
const https = require("https");
const qs = require("../helpers/querystring");

module.exports = function(baseUrl, httpMethod) {

  var format = ".json?";
  var nonce = crypto.randomBytes(32).toString("hex");
  var timestamp = Math.floor(new Date() / 1000);

  var auth = {
    "status": "New API Request",
    "include_entities": true,
    "oauth_consumer_key": process.env.TWITTER_KEY,
    "oauth_nonce": nonce,
    "oauth_signature_method": "HMAC-SHA1",
    "oauth_timestamp": timestamp,
    "oauth_token": process.env.TWITTER_OAUTH_TOKEN,
    "oauth_version": "1.0",
  };

  var authString = Object.keys(auth).sort().map((key) => `${ encodeURIComponent(key) }=${ encodeURIComponent(auth[key]) }`).join("&");

  var signatureBase = `${ httpMethod }&${ encodeURIComponent(baseUrl) }&${ authString }`

  var signingKey =  `${ encodeURIComponent(process.env.TWITTER_SECRET) }&${ encodeURIComponent(process.env.TWITTER_OAUTH_SECRET) }`

  var headers = {
    "Accept": "*/*",
    "Connection": "close",
    "User-Agent": "Stock Tracker App v1.0.0",
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": 76,
    "Host": "api.twitter.com"
  };

  var httpsOpts = {
    "headers": headers,
    "method": httpMethod,
    "path": baseUrl
  };

  const hmac = crypto.createHmac("sha1", signingKey);

  var oAuthSig = null;

  hmac.on("readable", () => {
    oAuthSig = hmac.read();

    if (oAuthSig !== null) {
      oAuthSig = new Buffer(oAuthSig).toString("base64");
    }
  });

  hmac.write(signatureBase);
  hmac.end();

  return oAuthSig;
};
