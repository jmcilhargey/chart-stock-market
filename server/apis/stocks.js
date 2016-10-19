"use strict";

const https = require("https");
const qs = require("../helpers/querystring");
const transform = require("../helpers/transformdata");

module.exports = {

  getQuote: function(stockSym) {

    var promise = new Promise((resolve, reject) => {

      var baseUrl = "https://www.quandl.com/api/v3/datasets/WIKI/";
      var format = ".json?"

      var dateObj = new Date();
      var currDate = `${ dateObj.getFullYear() }-${ dateObj.getMonth() + 1 }-${ dateObj.getDate() }`;
      var yearBefore = `${ dateObj.getFullYear() - 1 }-${ dateObj.getMonth() + 1 }-${ dateObj.getDate() }`;

      var httpsOpts = {
        "api_key": process.env.QUANDL_KEY,
        "start_date": yearBefore,
        "end_date": currDate,
      };

      var fullUrl = baseUrl + stockSym + format + qs(httpsOpts);

      var request = https.request(fullUrl, (response) => {

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
            resolve({
              "status": response.statusCode,
              "headers": response.headers,
              "symbol": jsonData.dataset.dataset_code,
              "data": transform(jsonData)
            });
          } else {
            resolve({
              "status": response.statusCode,
              "headers": response.headers,
              "message": response.statusMessage
            });
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
