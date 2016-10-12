"use strict"

require("../env");

const crypto = require("crypto");
const https = require("https");
const qs = require("../helpers/querystring");
const signature = require("./signature");
const tickers = require("./tickers");

var nonce = crypto.randomBytes(32).toString("hex");
var timestamp = Math.floor(new Date() / 1000);
var oAuthSig = signature("https://stream.twitter.com/1.1/statuses/filter.json", "POST", nonce);

var auth = {
  "oauth_consumer_key": process.env.TWITTER_KEY,
  "oauth_nonce": nonce,
  "oauth_signature": oAuthSig,
  "oauth_signature_method": "HMAC-SHA1",
  "oauth_timestamp": timestamp,
  "oauth_token": process.env.TWITTER_OAUTH_TOKEN,
  "oauth_version": "1.0"
};

var authString = Object.keys(auth).map((key) => `${ key }="${ encodeURIComponent(auth[key]) }"`).join(", ");

var headers = {
  "Accept": "*/*",
  "User-Agent": "Stock Tracker App v1.0.0",
  "Content-Type": "application/x-www-form-urlencoded",
  "Authorization": "OAuth " + authString,
};

var format = ".json?";
var urlParams = {
  "track": "trump"
};

var httpsOpts = {
  "hostname": "stream.twitter.com",
  "headers": headers,
  "method": "POST",
  "path": "/1.1/statuses/filter" + format + qs(urlParams)
}

var request = https.request(httpsOpts, (response) => {

  response.setEncoding("UTF-8");

  if (response.statusCode === 200) {

    response.on("data", (chunk) => {
        console.log(chunk)
    });
  }
  response.on("end", () => {

  });
});
request.on("error", (error) => {
  console.log(error);
});
request.end();
