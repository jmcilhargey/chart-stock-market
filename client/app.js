"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as io from "socket.io-client"
import "style!./main.css";

import StockForm from "./components/StockForm";
import StockGraph from "./components/StockGraph";
import StockList from "./components/StockList";
import StockButtons from "./components/StockButtons";
import StockTweets from "./components/StockTweets";

var socket = io.connect("http://localhost:3000", { reconnection: false });

socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("connect_error", (error) => {
    console.log(error);
});

var StockApp = React.createClass({

  handleStockRequest: function(stockData) {
    stockData.forEach((stock) => {
      console.log(stock);
    });
    if (this.state.stocks.length <= 5) {
      socket.emit("request_stock", stockData);
    }
  },
  handleTweetRequest: function(symbol) {
    socket.emit("request_tweets", symbol);
  },
  handleRemoveStock: function(stockIndex) {
    socket.emit("delete_stock", this.state.stocks[stockIndex]._id);

    this.setState({
      stocks: this.state.stocks.filter((stock, index) => index !== stockIndex)
    });
  },
  handleTimeChange: function(newTime) {
    this.setState({
      time: newTime
    });
  },
  getInitialState: function() {
    return {
      stocks: [],
      time: { days: 0, months: 0, years: 1 },
      tweets: []
    };
  },
  componentDidMount: function() {

    socket.on("get_stocks", (stockList) => {
      this.setState({
        stocks: stockList
      });
    });

    socket.on("add_stock", (addedStock) => {

      if (addedStock.error) {

      } else {
        var newState = this.state.stocks.slice();
        newState.push(addedStock);

        this.setState({
          stocks: newState
        });
      }
    });

    socket.on("get_tweets", (tweetList) => {
      tweetList.forEach((tweet) => {
        console.log(tweet);
      });
      this.setState({
        tweets: tweetList
      });
    });

    socket.on("search_error", (errorMessage) => {
      console.log(errorMessage);
    });
  },
  render: function() {
    return (
      <div className="stockApp">
        <StockForm onStockRequest={ this.handleStockSubmit }/>
        <StockList stocks={ this.state.stocks } onRemoveStock={ this.handleRemoveStock } onAddTweets={ this.handleTweetRequest }/>
        <StockButtons onTimeChange= { this.handleTimeChange } />
        <StockGraph stocks={ this.state.stocks } time={ this.state.time }/>
        <StockTweets tweets={ this.state.tweets } />
      </div>
    );
  }
});

ReactDOM.render(
  <StockApp />,
  document.getElementById("app")
);
