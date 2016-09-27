"use strict";

import * as React from "react";
import StockBox from "./StockBox";

var StockList = React.createClass({
  render: function() {

    var stockNodes = this.props.data.map((stock) => {
      return (
        <StockBox symbol={ stock.symbol } key= { stock._id } />
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
