"use strict";

import * as React from "react";
import D3Graph from "./D3Graph"

var StockGraph = React.createClass({
  shouldComponentUpdate: function() {
    return this.props.data.length
  },
  componentWillUpdate: function() {
    D3Graph.clear();
  },
  componentDidUpdate: function() {
    D3Graph.create(this.props.data);
  },
  render: function() {
    return (
      <div className="stockGraph">
        <canvas width="800" height="500"></canvas>
      </div>
    );
  }
});

export default StockGraph;
