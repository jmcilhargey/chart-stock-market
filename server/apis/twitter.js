"use strict";

require("../env");

const https = require("https");
const qs = require("../helpers/querystring");
const encode = require("../helpers/encodeuri")

module.exports = {

  getToken: function() {

    var promise = new Promise((resolve, reject) => {

      var credentials = encode(process.env.TWITTER_KEY) + ":" + encode(process.env.TWITTER_SECRET);

      var headers = {
        "Host": "api.twitter.com",
        "User-Agent": "Stock Tracker App v1.0.0",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Accept-Encoding": "gzip",
        "Authorization": "Basic " + credentials,
        "Content-Length": 29
      };

      var httpsOpts = {
        "hostname": "api.twitter.com",
        "headers": headers,
        "port": 80,
        "path": "/oauth2/token",
        "method": "POST"
      };

      var request = https.request(httpsOpts, (response) => {

        var string = "";

        response.on("data", (chunk) => {
          string += chunk;
        });

        response.on("end", () => {

          try {
            var jsonData = JSON.parse(string);
          } catch (error) {
            reject(error);
          }

          if (response.statusCode === 200) {
            resolve(jsonData);
          } else {
            reject(jsonData);
          }
        });
      });
      request.on("error", (error) => {
        reject(error);
      });
      request.end();
    });
    return promise;
  }
};
