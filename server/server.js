"use strict";

var express = require("express");
var mongoose = require("mongoose");
var https = require("https");
require('dotenv').config();

mongoose.connect("mongodb://localhost:27017/test");
mongoose.connection.on("error", function(err) {
  console.error("MongoDB error " + err);
  process.exit(-1);
});

var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use(express.static(__dirname + "/../client"));

io.on("connection", function(socket) {
  console.log("Connected on " + socket);
  
  io.on("disconnect", function() {
    console.log("Disconnected");
  });
});

app.route("/api/stock").get(function(req, res) {
  
  var baseUrl = "https://www.quandl.com/api/v3/datasets/WIKI/";
  var stockSym = "AAPL";

  var dateObj = new Date();
  var currDate = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();

  var fullUrl = baseUrl + stockSym + "/data.json?" + "api_key="+ process.env.QUANDL_KEY + "&start_date=" + "2016-01-01" + "&end_date=" + currDate;
  var data = "";
  
  console.log(process.env.QUANDL_KEY);
  
  https.get(fullUrl, function(res) {
    
    
    res.on("data", function(chunk) {
      data += chunk;
    });
    
    res.on("end", function() {
      
      data = JSON.parse(data);
      console.log(data);
    });
  });
});

app.route("/*").get(function(req, res) {
  res.sendFile(process.cwd() + "/client/index.html");
});

server.listen(process.env.PORT, function() {
  console.log("Listening on port " + process.env.PORT);
});