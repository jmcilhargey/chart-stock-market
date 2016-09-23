"use strict";

module.exports = function(jsonData) {

  var initialPrice = jsonData.dataset.data[jsonData.dataset.data.length - 1][4];

  return jsonData.dataset.data.map((day) => {
    return {
      date: Date.parse(day[0]),
      price: day[4],
      percent: (((day[4] - initialPrice) / initialPrice) * 100).toFixed(2)
    };
  }).sort((a, b) => a.date - b.date);
};
