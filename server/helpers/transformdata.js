"use strict";

module.exports = function(jsonData) {

  return jsonData.dataset.data.map((day) => {
    return {
      date: Date.parse(day[0]),
      price: day[4]
    };
  }).sort((a, b) => a.date - b.date );
};
