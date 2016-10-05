"use strict";

import * as d3 from "d3";

var D3Graph = {};

D3Graph.clear = function() {

  var canvas1 = document.getElementsByTagName("canvas")[0];
  var context1 = canvas1.getContext("2d");

  var canvas2 = document.getElementsByTagName("canvas")[1];
  var context2 = canvas2.getContext("2d");

  context1.setTransform(1, 0, 0, 1, 0, 0);
  context1.clearRect(0, 0, canvas1.width, canvas1.height);

  context2.setTransform(1, 0, 0, 1, 0, 0);
  context2.clearRect(0, 0, canvas2.width, canvas2.height);

}

D3Graph.transform = function(data, timeObj) {

  var currDate = new Date();

  if (timeObj.days) {
    currDate.setDate(currDate.getDate() - timeObj.days)
  }

  if (timeObj.months) {
    currDate.setMonth(currDate.getMonth() - timeObj.months);
  }

  if (timeObj.years) {
    currDate.setYear(currDate.getYear() - timeObj.years);
  }

  var cutoffDate = currDate.getTime();

  data = data.map((currStock) => {
      currStock.data = currStock.data.filter((dayData) => {
        if (dayData.date > cutoffDate) {
          return dayData;
        }
      });
      return currStock
  });

  data.forEach((currStock) => {
    var initialStockPrice = currStock.data[0].price;
    currStock.data.forEach((dayData) => {
      dayData.percent = (((dayData.price - initialStockPrice) / initialStockPrice) * 100).toFixed(2);
    });
  });
  return data;
}

D3Graph.create = function(data) {

  var parseTime = d3.timeParse("%Y-%m-%d");
  var colors = d3.scaleOrdinal(d3.schemeCategory10);

  var margin = { top: 15, right: 15, bottom: 20, left: 35 };
  var header = 50;

  var canvas1 = document.getElementById("lineGraph");
  var canvas2 = document.getElementById("priceGraph");
  var context1 = canvas1.getContext("2d");
  var context2 = canvas2.getContext("2d");

  var width = canvas1.width - margin.right - margin.left;
  var height = canvas1.height - margin.top - margin.bottom;

  var xScale = d3.scaleTime().range([0, width]);
  var yScale = d3.scaleLinear().range([height, header]).nice();

  context1.translate(margin.left, margin.top);

  var flattenedArray = [].concat.apply([], data.map((d) => d.data));

  xScale.domain(d3.extent(flattenedArray, (d) => new Date(d.date)));
  yScale.domain(d3.extent(flattenedArray, (d) => parseFloat(d.percent)));

  var tickCount = 10;
  var tickSize = 5;

  drawXAxis();
  drawYAxis();
  drawStockData(data);

  canvas1.addEventListener("mousemove", (e) => {
    var location = getMouseLocation(e);

    if (location.xPos > margin.left && location.xPos < width + margin.left) {

      context2.clearRect(0, 0, canvas2.width, canvas2.height - margin.bottom - margin.top);

      if (data.length) {
        drawVerticalLine(location);
        showStockPrice(location);
      }
    }
  });

  function getMouseLocation(e) {
    var rectangle = canvas1.getBoundingClientRect();
    return {
      xPos: e.clientX - rectangle.left,
      yPos: e.clientY - rectangle.top
    };
  }

  var bisectDate = d3.bisector((d, x) => new Date(d.date) - x ).left;
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var currencyFormat = d3.format(",.2f");
  var percentFormat = d3.format(".2%");

  context1.textAlign = "start";

  function showStockPrice(location) {

    var approxDate = xScale.invert(location.xPos - margin.left);
    var dateIndex = bisectDate(data[0].data, approxDate);

    var stockDate = new Date(data[0].data[dateIndex].date);
    var dateMessage = `${ monthNames[stockDate.getMonth()] } ${ stockDate.getDate() }`;

    context2.font = "24pt Calibri";
    context2.fillStyle = "#757575";
    context2.fillText(dateMessage, canvas1.width - 100, canvas1.height - 50);

    data.forEach((stock, index, array) => {

      var startLeft = margin.left + 50 + (index % 3) * 225;
      var startTop = margin.top + Math.floor(index / 3) * 40;

      context2.beginPath();
      context2.arc(startLeft - 10, startTop - 5, 5, 2 * Math.PI, false);
      context2.font = "14pt Calibri";
      context2.fillStyle = colors(index);
      context2.fill();

      var stockPrice = stock.data[dateIndex].price;
      var stockPercent = stock.data[dateIndex].percent;

      var stockMessage = `${ stock.symbol } $${ currencyFormat(stockPrice) } ${ stockPercent }%`;

      context2.fillText(stockMessage, startLeft, startTop);
    });
    context2.closePath();
  }

  function drawVerticalLine(location) {

    context2.beginPath();
    context2.moveTo(location.xPos, header + margin.top);
    context2.lineTo(location.xPos, height);
    context2.strokeStyle = "#757575";
    context2.lineWidth = 1;
    context2.setLineDash([2, 5]);
    context2.stroke();
    context2.closePath();
  }

  function drawStockData(data) {

    data.forEach((stock, index) => {

      var lineData = d3.line()
        .x((d) => xScale(new Date(d.date)))
        .y((d) => yScale(d.percent))
        .context(context1);
      context1.beginPath();
      lineData(stock.data);
      context1.strokeStyle = colors(index);
      context1.lineWidth = 2;
      context1.setLineDash([]);
      context1.stroke();

    });
    context1.closePath();
  }

  function drawXAxis() {
    var ticks = xScale.ticks(tickCount);
    var tickFormat = xScale.tickFormat();

    context1.beginPath();
    ticks.forEach((t) => {
      context1.moveTo(xScale(t), height);
      context1.lineTo(xScale(t), height + tickSize);
    });
    context1.font = "10pt Calibri";
    context1.strokeStyle = "#616161";
    context1.stroke();

    context1.textAlign = "center";
    context1.textBaseline = "top";
    context1.fillStyle = "#616161"
    ticks.forEach((t) => {
      context1.fillText(tickFormat(t), xScale(t), height + tickSize);
    });
    context1.closePath();
  }

  function drawYAxis() {
    var tickPadding = 5;
    var ticks = yScale.ticks(tickCount);
    var tickFormat = yScale.tickFormat(tickCount);

    context1.beginPath();
    ticks.forEach((t) => {
      context1.moveTo(0, yScale(t));
      context1.lineTo(-6, yScale(t));
    });
    context1.font = "10pt Calibri";
    context1.strokeStyle = "#616161";
    context1.stroke();

    context1.textAlign = "right";
    context1.textBaseline = "middle";
    context1.fillStyle = "#616161"
    ticks.forEach(function(d) {
      context1.fillText(tickFormat(d), -tickSize - tickPadding, yScale(d));
    });
    context1.closePath();
  }
}

export default D3Graph;
