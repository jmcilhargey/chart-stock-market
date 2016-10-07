"use strict";

import * as React from "react";
import StockBox from "./StockBox";

var StockList = React.createClass({
  onRemoveStock: function(index) {
    this.props.onRemoveStock(index);
  },
  onAddTweets: function(symbol) {
    this.props.onAddTweets(symbol);
  },
  render: function() {

    var stockNodes = this.props.stocks.map((stock, index) => {
      return (
        <StockBox
        symbol={ stock.symbol }
        key={ index }
        index={ index }
        onRemoveStock= { this.onRemoveStock }
        onAddTweets= { this.onAddTweets } />
      );
    });

    return (
      <div className="stockList">
        { stockNodes }
      </div>
    );
  }
});

export default StockList;
