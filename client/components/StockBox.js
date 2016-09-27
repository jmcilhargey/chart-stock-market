"use strict";

import * as React from "react";

var StockBox = React.createClass({

  handleClick: function() {
    this.props.onRemoveStock(this.props.index);
  },
  render: function() {
    return (
      <div className="stockBox">
        <span onClick={ this.handleClick } className="closeBox">x</span>
        <p>{ this.props.symbol }</p>

      </div>
    );
  }
});

module.exports = StockBox;
