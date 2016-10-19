"use strict";

const https = require("https");
const qs = require("../helpers/querystring");
const encode = require("../helpers/encodeuri")

module.exports = {

  getData: function(hashTag) {

    var promise = new Promise((resolve, reject) => {

        var headers = {
          "User-Agent": "Stock Tracker App v1.0.0",
          "Authorization": "Bearer " + process.env.TWITTER_SEARCH_TOKEN
        };

        var format = ".json?";

        var urlParams = {
          "q": "#" + hashTag,
          "lang": "en",
          "result_type": "mixed",
          "count": 100
        };

        var httpsOpts = {
          "hostname": "api.twitter.com",
          "headers": headers,
          "method": "GET",
          "path": "/1.1/search/tweets" + format + qs(urlParams)
        }

        var request = https.request(httpsOpts, (response) => {

          var string = "";

          response.setEncoding("utf-8");

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
  },
  getToken: function() {

    var promise = new Promise((resolve, reject) => {

      var credentials = new Buffer(encode(process.env.TWITTER_KEY) + ":" + encode(process.env.TWITTER_SECRET)).toString("base64");

      var headers = {
        "User-Agent": "Stock Tracker App v1.0.0",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Authorization": "Basic " + credentials,
        "Transfer-Encoding": "chunked"
      };

      var httpsOpts = {
        "hostname": "api.twitter.com",
        "headers": headers,
        "path": "/oauth2/token",
        "method": "POST"
      };

      var request = https.request(httpsOpts, (response) => {

        var body = [];

        response.on("data", (chunk) => {
          body.push(chunk);
        });

        response.on("end", () => {
          try {
            var jsonData = JSON.parse([].concat(body).toString());
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
      request.write("grant_type=client_credentials");
      request.end();
    });
    return promise;
  }
};
