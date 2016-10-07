"use strict";

import * as React from "react";

var StockBox = React.createClass({

  handleClickBox: function() {
    this.props.onRemoveStock(this.props.index);
  },
  handleClickTweets: function() {
    this.props.onAddTweets(this.props.symbol)
  },
  render: function() {
    return (
      <div className="stockBox">
        <span onClick={ this.handleClickBox } className="closeBox">x</span>
        <p onClick={ this.handleClickTweets }>{ this.props.symbol }</p>
      </div>
    );
  }
});

module.exports = StockBox;
