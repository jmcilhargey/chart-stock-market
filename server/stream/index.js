"use strict"

require("../env");

const fs = require("fs");
const crypto = require("crypto");
const https = require("https");
const qs = require("../helpers/querystring");
const signature = require("./signature")

fs.readFile(__dirname + "/s_and_p_500_co_list.csv", (error, data) => {

  if (error) { console.log(error); }

  if (Buffer.isBuffer(data)) {
    var array = data.toString("utf8").split("\n").map((stock) => stock.split(","));
  }
});

var format = ".json?"
var nonce = crypto.randomBytes(32).toString("hex");
var timestamp = Math.floor(new Date() / 1000);
var oAuthSig = signature("https://" + options.hostname + options.path, options.method);

var options = {
  "hostname": "stream.twitter.com",
  "path": "/1.1/statuses/filter.json",
  "headers": headers,
  "method": "POST"
};

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
  "Authorization": "Oauth " + authString
};
