"use strict";

import * as React from "react";

var StockButtons = React.createClass({

  handleClick: function(e) {

    var timeFrame = { days: 0, months: 0, years: 0 };
    var clickedText = e.target.innerHTML;

    switch (clickedText) {
      case "1m": timeFrame.months = 1;
      break;
      case "3m": timeFrame.months = 3;
      break;
      case "6m": timeFrame.months = 6;
      break;
      case "1yr": timeFrame.years = 1;
      break;
    }
    this.props.onTimeChange(timeFrame);
  },
  render: function() {
    var buttonText = ["1m", "3m", "6m", "1yr"];

    var buttonNodes = buttonText.map((currText, index) => {
      return <button onClick={ this.handleClick } className="stockButton" key={ index } type="button">{ currText }</button>
    });

    return (
      <div className="buttonList">
        { buttonNodes }
      </div>
    );
  }
});

module.exports = StockButtons;
