var path = require("path");

var HTMLWebpackPlugin = require("html-webpack-plugin");
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + "/client/index.html",
  filename: "index.html",
  inject: "body"
});

module.exports = {
  entry: path.join(__dirname, "./client/app.js"),
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        loader: "style!css"
      }
    ]
  },
  output: {
    path: path.join(__dirname, "./build"),
    filename: "bundle.js"
  },
  plugins: [HTMLWebpackPluginConfig]
};
