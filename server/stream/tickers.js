"use strict";

const fs = require("fs");

module.exports = function() {
  return fs.readFileSync(__dirname + "/s_and_p_500_co_list.csv").toString("utf8").split("\n").map((line) => line.substr(0, line.indexOf(","))).filter((symbol) => symbol.length > 0 && symbol.length < 5).join(",#");
}
