"use strict";

import * as React from "react";
import StockBox from "./StockBox";

var StockList = React.createClass({
  onRemoveStock: function(index) {
    this.props.onRemoveStock(index);
  },
  render: function() {

    var stockNodes = this.props.data.map((stock, index) => {
      return (
        <StockBox
        symbol={ stock.symbol }
        key={ index }
        index={ index }
        onRemoveStock= { this.onRemoveStock } />
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
