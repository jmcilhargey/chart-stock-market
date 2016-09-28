"use strict";

import * as React from "react";

var GraphButtons = React.createClass({

  render: function() {
    var buttonText = ["1d", "5d", "1m", "3m", "1yr"];

    var buttonNodes = buttonText.map((currText) => {
      return <button className="graphButtons" type="button">{ currText }</button>
    });

    return (
      <div>
        { buttonNodes }
      </div>
    );
  }
});

module.exports = GraphButtons;
