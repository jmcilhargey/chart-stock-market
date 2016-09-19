"use strict";

require("./env");

const express = require("express");
const mongoose = require("mongoose");
const https = require("https");

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const stocks = require("./apis/stocks");

mongoose.connect("mongodb://localhost:27017/test");

mongoose.connection.on("error", (error) => {
  console.error("MongoDB error: " + error);
  process.exit(-1);
});

app.use(express.static(__dirname + "/../build"));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("request_quote", (data) => {
    
    stocks.getQuote(data.stockSymbol).then((data) => {
      socket.emit("stock_data", JSON.stringify(data));

    }, (error) => {
      console.log(error);
    });
  });

  socket.on("delete_quote", (data) => {
    console.log(data);
  });

  socket.on("change_range", (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.route("/api/stock").get((req, res) => {



});

app.route("/*").get((req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + (process.env.PORT || 3000));
});
