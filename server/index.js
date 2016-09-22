"use strict";

require("./env");

const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const https = require("https");

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const stocks = require("./apis/stocks");

MongoClient.connect("mongodb://localhost:27017/test", (error, db) => {

  if (error) {
    console.error("MongoDB error: " + error);
    process.exit(-1);
  }
  console.log("Connected to MongoDB");

  io.on("connection", (socket) => {
    console.log("User connected");

    db.collection("stocks").find({}).limit(5).toArray((err, data) => {
      if (err) {
        console.log(err);
      }
      socket.emit("initial_stocks", data);
    });

    socket.on("request_stock", (data) => {

      stocks.getQuote(data.stockSymbol).then((data) => {

        db.collection("stocks").insertOne(data, {
          "w": "majority",
          "wtimeout": 5000,
          "serializeFunctions": true
        }, (err, res) => {
          if (err) {
            console.log(err);
          }
          db.collection("stocks").findOne({ "_id": res.insertedId }, (err, doc) => {
            if (err) {
              console.log(err);
            }
            socket.emit("add_stock", doc);
          });
        });
      }, (err) => {
        console.log(err);
      });
    });

    socket.on("delete_quote", (data) => {
      console.log(data);
    });

    socket.on("change_dates", (data) => {
      console.log(data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

});

app.use(express.static(__dirname + "/../build"));

app.route("/*").get((req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + (process.env.PORT || 3000));
});
