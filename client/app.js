"use strict";

var React = require("react");
var ReactDOM = require("react-dom");

var StockChart = React.createClass({
  render: function() {
    return (
      <h1>{ this.props.message }</h1>
    );
  }
});

ReactDOM.render(
  <StockChart message="Stock App!" />,
  document.getElementById("app")
);

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        document.getElementById("stockText").innerHTML =
        xhttp.responseText;
    }
};

xhttp.open("GET", "api/stock", true);
xhttp.send();
