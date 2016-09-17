"use strict";

const express = require("express");
const mongoose = require("mongoose");
const https = require("https");

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

require("./env");

const stocks = require("./apis/stocks");

mongoose.connect("mongodb://localhost:27017/test");

mongoose.connection.on("error", (error) => {
  console.error("MongoDB error: " + error);
  process.exit(-1);
});

app.use(express.static(__dirname + "/../client"));

io.on("connection", (socket) => {
  console.log("Connected on " + socket);

  io.on("disconnect", () => {
    console.log("Disconnected");
  });
});

app.route("/api/stock").get((req, res) => {

  stocks.getQuote("AAPL").then((data) => {
    res.send(data);
  }, (error) => {
    res.send(error);
  });

});

app.route("/*").get((req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + (process.env.PORT || 3000));
});
