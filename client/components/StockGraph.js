"use strict";

import * as React from "react";
import D3Graph from "./D3Graph";

var StockGraph = React.createClass({

  getStockState: function() {
    return this.props.stocks;
  },
  getTimeState: function() {
    return this.props.time;
  },
  componentWillUpdate: function() {
    D3Graph.clear();
  },
  componentDidUpdate: function() {
    D3Graph.create(D3Graph.transform(JSON.parse(JSON.stringify(this.getStockState())), this.getTimeState()));
  },
  propTypes: {

  },
  render: function() {
    return (
      <div className="stockGraph">
        <canvas id="lineGraph" width="850" height="500"></canvas>
        <canvas id="priceGraph" width="850" height="500"></canvas>
      </div>
    );
  }
});

export default StockGraph;
