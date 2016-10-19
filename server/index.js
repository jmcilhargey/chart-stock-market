"use strict";

const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const https = require("https");

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const stocks = require("./apis/stocks");
const twitter = require("./apis/twitter");
const TwitterStream = require("./apis/stream");

MongoClient.connect(process.env.MLAB_URI, (error, db) => {

  if (error) {
    console.error("MongoDB error: " + error);
    process.exit(-1);
  }
  console.log("Connected to MongoDB");

  io.on("connection", (socket) => {

    db.collection("stocks").find({}).sort({ $natural: -1 }).limit(6).toArray((err, data) => {
      if (err) {
        console.log(err);
      }
      socket.emit("get_stocks", data);
    });

    socket.on("request_stock", (data) => {

      stocks.getQuote(data.stockSymbol).then((value) => {

        if (value.status !== 200) {
          socket.emit("search_error", { status: value.status, error: value.message });

        } else {
          db.collection("stocks").insertOne(value, {
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
              io.emit("add_stock", doc);
            });
          });
        }
      }).catch((reason) => {
        console.log(reason);
      });
    });

    var stream = null;

    socket.on("request_tweets", (data) => {

      if (stream !== null) {
        stream.closeStream();
      }

      var callback = function(data) {
        socket.emit("get_tweets", data);
      };

      stream = new TwitterStream(data, callback);
      stream.openStream();
    });

    socket.on("delete_stock", (id) => {

      db.collection("stocks").deleteOne({ "_id": ObjectId(id) }, {
        "w": 1,
        "wtimeout": 5000
      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        db.collection("stocks").find({}).sort({ $natural: -1 }).limit(6).toArray((err, data) => {
          if (err) {
            console.log(err);
          }
          io.emit("get_stocks", data);
        });
      });
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
