"use strict";

import * as React from "react";

var StockForm = React.createClass({
  getInitialState: function() {
    return {
      stockSymbol: ""
    };
  },
  handleStockChange: function(e) {
    this.setState({
      stockSymbol: e.target.value
    });
  },
  isValidSubmit: function(entry) {
    return /^[a-zA-Z-.]{1,5}$/.test(entry);
  },
  handleSubmit: function(e) {
    e.preventDefault();

    var stockSymbol = this.state.stockSymbol.trim();

    if (this.isValidSubmit(stockSymbol)) {
      this.props.onStockRequest({ stockSymbol: stockSymbol });
      this.setState({ stockSymbol: "" });
    }
  },
  render: function() {
    return (
      <form className="stockForm" onSubmit={ this.handleSubmit }>
        <input
          type="text"
          value={ this.state.stockSymbol }
          onChange={ this.handleStockChange }/>
        <input type="submit" value="Get Stock"/>
      </form>
    );
  }
});

export default StockForm;
