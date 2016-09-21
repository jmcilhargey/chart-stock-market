"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as io from "socket.io-client"
import "style!./main.css";

import D3Graph from "./graph"

var socket = io.connect("http://localhost:3000", { reconnection: false });

socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("connect_error", (error) => {
  console.log(error);
});

var StockForm = React.createClass({
  getInitialState: function() {
    return {
      stockSymbol: ""
    };
  },
  handleStockChange: function(e) {
    this.setState({
      stockSymbol: e.target.value
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();

    var stockSymbol = this.state.stockSymbol.trim();

    if (stockSymbol.length) {
      this.props.onStockSubmit({ stockSymbol: stockSymbol });
      this.setState({ stockSymbol: "" });
    }
  },
  render: function() {
    return (
      <form className="stockForm" onSubmit={ this.handleSubmit }>
        <input
          type="text"
          placeholder="Enter stock symbol"
          value={ this.state.stockSymbol }
          onChange={ this.handleStockChange }/>
        <input type="submit" value="Get Stock"/>
      </form>
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

var StockGraph = React.createClass({
  componentWillUpdate() {
    var canvas = document.getElementsByTagName("canvas")[0];
    D3Graph.clear(canvas)
  },
  componentDidUpdate: function() {
    var canvas = document.getElementsByTagName("canvas")[0];
    D3Graph.create(canvas, this.props.data);
  },
  render: function() {
    return (
      <div className="stockGraph">
        <canvas width="800" height="400"></canvas>
      </div>
    );
  }
});

var StockBox = React.createClass({
  handleStockSubmit: function(stockData) {
    socket.emit("request_quote", stockData);
  },
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentDidMount: function() {
    socket.on("stock_data", (data) => {

      var newData = this.state.data.slice();
      newData.push(data);

      this.setState({
        data: newData
      });
    });
  },
  render: function() {
    return (
      <div className="stockBox">
        <StockForm onStockSubmit={ this.handleStockSubmit }/>
        <StockList />
        <StockGraph data={ this.state.data }/>
      </div>
    );
  }
});

ReactDOM.render(
  <StockBox />,
  document.getElementById("stockApp")
);
