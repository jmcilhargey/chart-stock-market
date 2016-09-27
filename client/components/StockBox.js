"use strict";

import * as React from "react";

var StockBox = React.createClass({
  render: function() {
    return (
      <div className="stockBox">
        <p>{ this.props.symbol }</p>
      </div>
    );
  }
});

module.exports = StockBox;
