"use strict"

const crypto = require("crypto");
const https = require("https");
const qs = require("../helpers/querystring");

var TwitterStream = function(stockSym, callback) {
  this.request;
  this.method = "POST";
  this.url = "https://stream.twitter.com/1.1/statuses/filter.json";
  this.nonce = crypto.randomBytes(16).toString("hex");
  this.timestamp = Math.floor(new Date() / 1000);
  this.version = "1.0";
  this.language = "en";
  this.symbol = stockSym;
  this.callback = callback;
}

TwitterStream.prototype.closeStream = function() {
  this.request.abort();
  this.request.connection.destroy();
}

TwitterStream.prototype.openStream = function(tickerSymbol, callback) {

  var signatureAuth = {
    "oauth_consumer_key": process.env.TWITTER_KEY,
    "oauth_nonce": this.nonce,
    "oauth_signature_method": "HMAC-SHA1",
    "oauth_timestamp": this.timestamp,
    "oauth_token": process.env.TWITTER_OAUTH_TOKEN,
    "oauth_version": "1.0",
    "track": this.symbol,
    "language": this.language,
    "filter_level": "low"
  };

  var authString = Object.keys(signatureAuth).sort().map((key) => `${ key }=${ signatureAuth[key] }`).join("&");
  var signatureBase = `${ this.method }&${ encodeURIComponent(this.url) }&${ encodeURIComponent(authString) }`;
  var signingKey = `${ encodeURIComponent(process.env.TWITTER_SECRET) }&${ encodeURIComponent(process.env.TWITTER_OAUTH_SECRET) }`;

  var hmac = crypto.createHmac("sha1", signingKey);
  hmac.update(signatureBase);
  var oAuthSignature = hmac.digest("base64");

  var streamAuth = {
    "oauth_consumer_key": process.env.TWITTER_KEY,
    "oauth_nonce": this.nonce,
    "oauth_signature": oAuthSignature,
    "oauth_signature_method": "HMAC-SHA1",
    "oauth_timestamp": this.timestamp,
    "oauth_token": process.env.TWITTER_OAUTH_TOKEN,
    "oauth_version": "1.0"
  };

  var authString = Object.keys(streamAuth).map((key) => `${ key }="${ encodeURIComponent(streamAuth[key]) }"`).join(", ");

  var headers = {
    "Accept": "*/*",
    "Connection": "close",
    "User-Agent": "Stock Tracker App v1.0.0",
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": "OAuth " + authString
  };

  var requestParams = {
    "track": this.symbol,
    "language": this.language,
    "filter_level": "low"
  };

  var httpsOpts = {
    "hostname": "stream.twitter.com",
    "headers": headers,
    "method": this.method,
    "path": "/1.1/statuses/filter.json?" + qs(requestParams)
  }

  this.request = https.request(httpsOpts, (response) => {

    response.setEncoding("UTF-8");
    console.log(response.statusCode);
    if (response.statusCode === 200) {

      var tweet = [];
      var data;

      response.on("data", (chunk) => {
        console.log(chunk);
        var carrIndex = chunk.indexOf("\r\n");
        var string = "";

        if (chunk.length > 2 && carrIndex > -1) {

          tweet.push(chunk.slice(0, carrIndex));
          string = tweet.join("");

          try {
            data = JSON.parse(string);
          } catch(error) {
            data = error;
          }

          tweet = [];
          tweet.push(chunk.slice(carrIndex + 2));

          this.callback(data);
        } else {
          tweet.push(chunk);
        }
      });
    }
    response.on("end", () => {
      console.log("Stream disconnected");
    });
  });
  this.request.on("error", (error) => {
    console.log(error);
  });
  this.request.end();
}

module.exports = TwitterStream;
