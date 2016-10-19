"use strict";

import * as React from "react";

var StockTweets = React.createClass({
  formatDate: function(dateObj) {
    var dayName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dayClock = dateObj.getHours() >= 12 ? "PM" : "AM";
    var minutes = (dateObj.getMinutes() >= 10 ? "" : "0") + dateObj.getMinutes();
    console.log("minutes", minutes);
    return `${ dayName[dateObj.getDay()] } ${ monthNames[dateObj.getMonth()] } ${ dateObj.getDate() } ${ dateObj.getHours() % 12 }:${ minutes } ${ dayClock } `
  },
  render: function() {

    var tweetList = this.props.tweets.map((tweet, index) => {
      return (
        <div className="tweetList" key={ index }>
          <div>{ this.formatDate(new Date(tweet.created_at)) }</div>
          <div>{ tweet.text }</div>
        </div>
      );
    });
    return (
      <div className="stockTweets">
        <h3 className="tweetHeader">Streaming tweets for { this.props.ticker }</h3>
        { tweetList }
      </div>
    );
  }
});

module.exports = StockTweets;
