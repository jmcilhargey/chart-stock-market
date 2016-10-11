"use strict";

import * as React from "react";

var StockTweets = React.createClass({
  formatDate: function(dateObj) {
    var dayName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${ dayName[dateObj.getDay()] } ${ monthNames[dateObj.getMonth()] } ${ dateObj.getDate() } `
  },
  render: function() {

    var tweetList = this.props.tweets.map((tweet, index) => {
      return (
        <div key={ index }>
          <div>{ this.formatDate(new Date(tweet.created_at)) }</div>
          <div>{ tweet.text }</div>
          <div>{ tweet.retweet_count }</div>
        </div>
      );
    });
    return (
      <div className="stockTweets">
        <h3 className="tweetHeader">Recent tweets for #AAPL</h3>
        { tweetList }
      </div>
    )
  }
});

module.exports = StockTweets;
