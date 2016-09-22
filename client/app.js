"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as io from "socket.io-client"
import "style!./main.css";

import StockForm from "./components/StockForm";
import StockGraph from "./components/StockGraph";
import StockList from "./components/StockList";

var socket = io.connect("http://localhost:3000", { reconnection: false });

socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("connect_error", (error) => {
  console.log(error);
});

var StockBox = React.createClass({
  handleStockSubmit: function(stockData) {
    socket.emit("request_stock", stockData);
  },
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentDidMount: function() {

    socket.on("initial_stocks", (stockList) => {
      this.setState({
        data: stockList
      });
    });

    socket.on("add_stock", (addedStock) => {

      var copyState = this.state.data.slice();
      copyState.push(addedStock);

      this.setState({
        data: copyState
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
