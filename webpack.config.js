var HTMLWebpackPlugin = require("html-webpack-plugin");
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + "/client/index.html",
  filename: "index.html",
  inject: "body"
});

module.exports = {
  entry: __dirname + "/client/app.js",
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: __dirname + "/build"
  },
  plugins: [HTMLWebpackPluginConfig]
};
