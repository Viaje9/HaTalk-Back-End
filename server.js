const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const request = require("http");
const http = request.createServer(app);
const index = require("./routes/index");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

console.log(process.env.origin.split(" "));
const corsOptions = {
  origin: process.env.origin.split(" "),
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type"],
  credentials: true
};

mongoose.connect(process.env.db);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(index);

http.listen(PORT, () => {
  console.log("listening on *:", PORT);
});

// 喚醒heroku
if (process.env.NODE_ENV === "production") {
  setInterval(() => {
    request.get(process.env.url, (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", (res) => {
        console.log(data);
      });
    });
  }, 25 * 60 * 1000);
}

module.exports = http;
