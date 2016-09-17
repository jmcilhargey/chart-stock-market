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

var StockChart = React.createClass({
  render: function() {
    return (
      <h1>{ this.props.data }</h1>
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
      <div>
        <StockChart
          data={ this.state.data } />
      </div>
    );
  }
});

ReactDOM.render(
  <StockApp message="Stock App!" />,
  document.getElementById("header")
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
