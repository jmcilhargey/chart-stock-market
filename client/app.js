"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as d3 from "d3";

import * as io from "socket.io-client"
import "style!./main.css";

var socket = io.connect("http://localhost:3000", { reconnection: false });

socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("connect_error", (error) => {
  console.log(error);
});

socket.on("stock_data", (data) => {

    document.getElementById("stock-text").innerHTML = JSON.parse(data).dataset.description;
});

socket.emit("request_quote", { ticker: "AAPL" });

var FBStockData = [["2014-12-31",78.02],["2014-12-30",79.22],["2014-12-29",80.02],["2014-12-26",80.775],["2014-12-24",80.77],["2014-12-23",80.61],["2014-12-22",81.45],["2014-12-19",79.88],["2014-12-18",78.4],["2014-12-17",76.11],["2014-12-16",74.69],["2014-12-15",76.99],["2014-12-12",77.83],["2014-12-11",77.73],["2014-12-10",76.18],["2014-12-09",76.84],["2014-12-08",76.52],["2014-12-05",76.36],["2014-12-04",75.24],["2014-12-03",74.88],["2014-12-02",75.46],["2014-12-01",75.1],["2014-11-28",77.7],["2014-11-26",77.62],["2014-11-25",75.63],["2014-11-24",74.01],["2014-11-21",73.75],["2014-11-20",73.6],["2014-11-19",73.33],["2014-11-18",74.34],["2014-11-17",74.24],["2014-11-14",74.88],["2014-11-13",74.25],["2014-11-12",74.72],["2014-11-11",74.61],["2014-11-10",75.0],["2014-11-07",75.6],["2014-11-06",75.26],["2014-11-05",74.83],["2014-11-04",75.76],["2014-11-03",73.88],["2014-10-31",74.99],["2014-10-30",74.11],["2014-10-29",75.86],["2014-10-28",80.77],["2014-10-27",80.28],["2014-10-24",80.67],["2014-10-23",80.04],["2014-10-22",78.37],["2014-10-21",78.69],["2014-10-20",76.95],["2014-10-17",75.95],["2014-10-16",72.63],["2014-10-15",73.21],["2014-10-14",73.59],["2014-10-13",72.99],["2014-10-10",72.91],["2014-10-09",75.91],["2014-10-08",77.52],["2014-10-07",76.29],["2014-10-06",77.555],["2014-10-03",77.44],["2014-10-02",77.08],["2014-10-01",76.55],["2014-09-30",79.04],["2014-09-29",79.0],["2014-09-26",78.79],["2014-09-25",77.22],["2014-09-24",78.535],["2014-09-23",78.29],["2014-09-22",76.8],["2014-09-19",77.91],["2014-09-18",77.0],["2014-09-17",76.43],["2014-09-16",76.08],["2014-09-15",74.58],["2014-09-12",77.48],["2014-09-11",77.92],["2014-09-10",77.43],["2014-09-09",76.67],["2014-09-08",77.89],["2014-09-05",77.26],["2014-09-04",75.95],["2014-09-03",75.83],["2014-09-02",76.68],["2014-08-29",74.82],["2014-08-28",73.855],["2014-08-27",74.63],["2014-08-26",75.9601],["2014-08-25",75.02],["2014-08-22",74.57],["2014-08-21",74.57],["2014-08-20",74.81],["2014-08-19",75.29],["2014-08-18",74.59],["2014-08-15",73.63],["2014-08-14",74.296],["2014-08-13",73.77],["2014-08-12",72.83],["2014-08-11",73.44],["2014-08-08",73.06],["2014-08-07",73.17],["2014-08-06",72.47],["2014-08-05",72.69],["2014-08-04",73.51],["2014-08-01",72.36],["2014-07-31",72.65],["2014-07-30",74.677],["2014-07-29",73.71],["2014-07-28",74.92],["2014-07-25",75.19],["2014-07-24",74.98],["2014-07-23",71.29],["2014-07-22",69.27],["2014-07-21",69.4],["2014-07-18",68.4199],["2014-07-17",66.4099],["2014-07-16",67.66],["2014-07-15",67.165],["2014-07-14",67.9],["2014-07-11",66.34],["2014-07-10",64.8725],["2014-07-09",64.97],["2014-07-08",62.76],["2014-07-07",65.29],["2014-07-03",66.29],["2014-07-02",66.45],["2014-07-01",68.06],["2014-06-30",67.29],["2014-06-27",67.6],["2014-06-26",67.13],["2014-06-25",67.44],["2014-06-24",65.72],["2014-06-23",65.37],["2014-06-20",64.5],["2014-06-19",64.3415],["2014-06-18",65.6],["2014-06-17",64.4],["2014-06-16",64.19],["2014-06-13",64.5],["2014-06-12",64.2901],["2014-06-11",65.781],["2014-06-10",65.77],["2014-06-09",62.88],["2014-06-06",62.5],["2014-06-05",63.186],["2014-06-04",63.34],["2014-06-03",62.87],["2014-06-02",63.08],["2014-05-30",63.3],["2014-05-29",63.83],["2014-05-28",63.51],["2014-05-27",63.48],["2014-05-23",61.351],["2014-05-22",60.52],["2014-05-21",60.49],["2014-05-20",58.56],["2014-05-19",59.21],["2014-05-16",58.0199],["2014-05-15",57.919],["2014-05-14",59.23],["2014-05-13",59.83],["2014-05-12",59.83],["2014-05-09",57.24],["2014-05-08",56.76],["2014-05-07",57.39],["2014-05-06",58.53],["2014-05-05",61.22],["2014-05-02",60.46],["2014-05-01",61.15],["2014-04-30",59.78],["2014-04-29",58.15],["2014-04-28",56.14],["2014-04-25",57.71],["2014-04-24",60.87],["2014-04-23",61.36],["2014-04-22",63.0301],["2014-04-21",61.24],["2014-04-17",58.94],["2014-04-16",59.72],["2014-04-15",59.09],["2014-04-14",58.89],["2014-04-11",58.53],["2014-04-10",59.16],["2014-04-09",62.41],["2014-04-08",58.1901],["2014-04-07",56.95],["2014-04-04",56.749],["2014-04-03",59.49],["2014-04-02",62.72],["2014-04-01",62.62],["2014-03-31",60.24],["2014-03-28",60.01],["2014-03-27",60.97],["2014-03-26",60.385],["2014-03-25",64.89],["2014-03-24",64.1],["2014-03-21",67.24],["2014-03-20",66.97],["2014-03-19",68.24],["2014-03-18",69.19],["2014-03-17",68.7399],["2014-03-14",67.72],["2014-03-13",68.83],["2014-03-12",70.8799],["2014-03-11",70.1],["2014-03-10",72.03],["2014-03-07",69.8],["2014-03-06",70.84],["2014-03-05",71.57],["2014-03-04",68.8],["2014-03-03",67.41],["2014-02-28",68.46],["2014-02-27",68.94],["2014-02-26",69.26],["2014-02-25",69.85],["2014-02-24",70.78],["2014-02-21",68.59],["2014-02-20",69.63],["2014-02-19",68.06],["2014-02-18",67.3],["2014-02-14",67.09],["2014-02-13",67.33],["2014-02-12",64.45],["2014-02-11",64.851],["2014-02-10",63.548],["2014-02-07",64.32],["2014-02-06",62.16],["2014-02-05",62.19],["2014-02-04",62.75],["2014-02-03",61.48],["2014-01-31",62.57],["2014-01-30",61.08],["2014-01-29",53.53],["2014-01-28",55.14],["2014-01-27",53.55],["2014-01-24",54.45],["2014-01-23",56.63],["2014-01-22",57.51],["2014-01-21",58.51],["2014-01-17",56.3],["2014-01-16",57.19],["2014-01-15",57.6],["2014-01-14",57.74],["2014-01-13",55.91],["2014-01-10",57.94],["2014-01-09",57.22],["2014-01-08",58.23],["2014-01-07",57.92],["2014-01-06",57.2],["2014-01-03",54.557],["2014-01-02",54.71]];
var margin = { top: 15, right: 15, bottom: 20, left: 25 };

var canvas = document.getElementsByTagName("canvas")[0];
var context = canvas.getContext("2d");

var width = canvas.width - margin.right - margin.left;
var height = canvas.height - margin.top - margin.bottom;

var xScale = d3.scaleTime().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);

var parseTime = d3.timeParse("%Y-%m-%d");

context.translate(margin.left, margin.top);

var stockData = FBStockData.map((stock) => {
  return {
    price: stock[1],
    date: parseTime(stock[0])
  };
});

stockData.sort((a, b) => a.date - b.date );

xScale.domain(d3.extent(stockData, (d) => d.date ));
yScale.domain(d3.extent(stockData, (d) => d.price ));

var tickCount = 10;
var tickSize = 5;

drawXAxis();
drawYAxis();
drawStockData(stockData);

canvas.addEventListener("mousemove", (e) => {
  var location = getMouseLocation(e);

  if (location.xPos > margin.left && location.xPos < width + margin.left) {

    context.clearRect(0, 0, canvas.width, canvas.height - margin.bottom - margin.top);
    drawStockData(stockData);
    drawVerticalLine(location);
    showStockPrice(location);
  }
});

function getMouseLocation(e) {
  var rectangle = canvas.getBoundingClientRect();
  return {
    xPos: e.clientX - rectangle.left,
    yPos: e.clientY - rectangle.top
  };
}

var bisectDate = d3.bisector((d, x) => d.date - x ).left;

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var currencyFormat = d3.format(",.2f");

function showStockPrice(location) {

  var approxDate = xScale.invert(location.xPos - margin.left);
  var dateIndex = bisectDate(stockData, approxDate);

  var stockDate = stockData[dateIndex].date;
  var dateMessage = `${ monthNames[stockDate.getMonth()] } ${ stockDate.getDate() }`;

  context.font = "20pt Calibri";
  context.textAlign="start";
  context.fillText(dateMessage, margin.left, margin.top);

  var stockPrice = stockData[dateIndex].price;
  var stockMessage = `$${ currencyFormat(stockPrice) }`

  context.font = "20pt Calibri";
  context.textAlign="start";
  context.fillText(stockMessage, margin.left + 100, margin.top);
}

function drawVerticalLine(location) {

  context.beginPath();
  context.moveTo(location.xPos - margin.left, 0);
  context.lineTo(location.xPos - margin.left, height);
  context.strokeStyle = "#bdbdbd";
  context.lineWidth = 1;
  context.setLineDash([2, 5]);
  context.stroke();
}

function drawStockData(data) {

  var lineData = d3.line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.price))
    .context(context);

  context.beginPath();
  lineData(data);
  context.strokeStyle = "#6200ea";
  context.lineWidth = 1.5;
  context.setLineDash([]);
  context.stroke();
}

function drawXAxis() {
  var ticks = xScale.ticks(tickCount);
  var tickFormat = xScale.tickFormat();

  context.beginPath();
  ticks.forEach((t) => {
    context.moveTo(xScale(t), height);
    context.lineTo(xScale(t), height + tickSize);
  });
  context.strokeStyle = "#616161";
  context.stroke();

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
  context.strokeStyle = "#616161";
  context.stroke();

  context.textAlign = "right";
  context.textBaseline = "middle";
  context.fillStyle = "#616161"
  ticks.forEach(function(d) {
    context.fillText(tickFormat(d), -tickSize - tickPadding, yScale(d));
  });
}

var StockForm = React.createClass({
  render: function() {
    return (
      <div className="stockForm"></div>
    );
  }
});

var StockList = React.createClass({
  render: function() {
    return (
      <div className="stockData"></div>
    );
  }
});

var StockBox = React.createClass({
  render: function() {
    return (
      <div className="stockBox"></div>
    );
  }
});

var StockApp = React.createClass({
  getInitialState: function() {
    return {
      data: "Stock App!"
    };
  },
  render: function() {
    return (
      <div className="stockApp">
        <StockForm />
        <StockData />
      </div>
    );
  }
});

ReactDOM.render(
  <StockApp />,
  document.getElementById("app")
);
/*
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        document.getElementById("stock-text").innerHTML =
        xhttp.responseText;
    }
};

xhttp.open("GET", "api/stock", true);
xhttp.send();*/
