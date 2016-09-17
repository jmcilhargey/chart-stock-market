"use strict";

require("../env");

const https = require("https");
const qs = require("../helpers/querystring");

module.exports = {

  getQuote: function(stockSym) {

    var promise = new Promise((resolve, reject) => {

      var baseUrl = "https://www.quandl.com/api/v3/datasets/WIKI/";
      var format = ".json?"

      var dateObj = new Date();
      var currDate = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();

      var httpsOpts = {
        "api_key": process.env.QUANDL_KEY,
        "start_date": "2016-01-01",
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
            resolve(JSON.parse(string));
          } catch (error) {
            reject(error);
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
