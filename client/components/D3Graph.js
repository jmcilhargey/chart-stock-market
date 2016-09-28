"use strict";

import * as d3 from "d3";

var D3Graph = {};

D3Graph.clear = function() {

  var canvas = document.getElementsByTagName("canvas")[0];
  var context = canvas.getContext("2d");

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
}

D3Graph.create = function(data) {

  var parseTime = d3.timeParse("%Y-%m-%d");
  var colors = d3.scaleOrdinal(d3.schemeCategory10);

  var margin = { top: 15, right: 15, bottom: 20, left: 35 };
  var header = 75;

  var canvas = document.getElementsByTagName("canvas")[0];
  var context = canvas.getContext("2d");

  var width = canvas.width - margin.right - margin.left;
  var height = canvas.height - margin.top - margin.bottom;

  var xScale = d3.scaleTime().range([0, width]);
  var yScale = d3.scaleLinear().range([height, header]);

  context.translate(margin.left, margin.top);

  var flattenedArray = [].concat.apply([], data.map((d) => d.data));

  xScale.domain(d3.extent(flattenedArray, (d) => new Date(d.date)));
  yScale.domain(d3.extent(flattenedArray, (d) => parseInt(d.percent)));

  var tickCount = 10;
  var tickSize = 5;

  drawXAxis();
  drawYAxis();
  drawStockData(data);

  canvas.addEventListener("mousemove", (e) => {
    var location = getMouseLocation(e);

    if (location.xPos > margin.left && location.xPos < width + margin.left) {

      context.clearRect(0, 0, canvas.width, canvas.height - margin.bottom - margin.top);

      if (data.length) {
        drawStockData(data);
        drawVerticalLine(location);
        showStockPrice(location);
      }
    }
  });

  function getMouseLocation(e) {
    var rectangle = canvas.getBoundingClientRect();
    return {
      xPos: e.clientX - rectangle.left,
      yPos: e.clientY - rectangle.top
    };
  }

  var bisectDate = d3.bisector((d, x) => new Date(d.date) - x ).left;
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var currencyFormat = d3.format(",.2f");
  var percentFormat = d3.format(".2%");


  context.textAlign = "start";

  function showStockPrice(location) {

    var approxDate = xScale.invert(location.xPos - margin.left);
    var dateIndex = bisectDate(data[0].data, approxDate);

    var stockDate = new Date(data[0].data[dateIndex].date);
    var dateMessage = `${ monthNames[stockDate.getMonth()] } ${ stockDate.getDate() }`;

    context.font = "24pt Calibri";
    context.fillStyle = "#757575";
    context.fillText(dateMessage, canvas.width - 175, canvas.height - 75);

    data.forEach((stock, index, array) => {

      var startLeft = margin.left + (index % 3) * 250;
      var startTop = margin.top + Math.floor(index / 3) * 40;

      context.beginPath();
      context.arc(startLeft - 10, startTop, 5, 2 * Math.PI, false);
      context.font = "14pt Calibri";
      context.fillStyle = colors(index);
      context.fill();
      context.closePath();

      var stockPrice = stock.data[dateIndex].price;
      var stockPercent = stock.data[dateIndex].percent;

      var stockMessage = `${ stock.symbol } $${ currencyFormat(stockPrice) } ${ stockPercent }%`;

      context.fillText(stockMessage, startLeft, startTop);
    });
  }

  function drawVerticalLine(location) {

    context.beginPath();
    context.moveTo(location.xPos - margin.left, header);
    context.lineTo(location.xPos - margin.left, height);
    context.strokeStyle = "#757575";
    context.lineWidth = 1;
    context.setLineDash([2, 5]);
    context.stroke();
    context.closePath();
  }

  function drawStockData(data) {



    data.forEach((stock, index) => {

      var lineData = d3.line()
        .x((d) => xScale(new Date(d.date)))
        .y((d) => yScale(d.percent))
        .context(context);
      context.beginPath();
      lineData(stock.data);
      context.strokeStyle = colors(index);
      context.lineWidth = 2;
      context.setLineDash([]);
      context.stroke();
      context.closePath();
    });
  }

  function drawXAxis() {
    var ticks = xScale.ticks(tickCount);
    var tickFormat = xScale.tickFormat();

    context.beginPath();
    ticks.forEach((t) => {
      context.moveTo(xScale(t), height);
      context.lineTo(xScale(t), height + tickSize);
    });
    context.font = "10pt Calibri";
    context.strokeStyle = "#616161";
    context.stroke();
    context.closePath();

    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillStyle = "#616161"
    ticks.forEach((t) => {
      context.fillText(tickFormat(t).substr(0, 3), xScale(t), height + tickSize);
    });
  }

  function drawYAxis() {
    var tickPadding = 5;
    var ticks = yScale.ticks(tickCount);
    var tickFormat = yScale.tickFormat(tickCount);

    context.beginPath();
    ticks.forEach((t) => {
      context.moveTo(0, yScale(t));
      context.lineTo(-6, yScale(t));
    });
    context.font = "10pt Calibri";
    context.strokeStyle = "#616161";
    context.stroke();
    context.closePath();

    context.textAlign = "right";
    context.textBaseline = "middle";
    context.fillStyle = "#616161"
    ticks.forEach(function(d) {
      context.fillText(tickFormat(d), -tickSize - tickPadding, yScale(d));
    });
  }
}

export default D3Graph;
