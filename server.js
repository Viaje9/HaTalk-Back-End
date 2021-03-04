const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http").createServer(app);
const request = require("request");
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

mongoose.connect(process.env.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(index);

http.listen(PORT, () => {
  console.log("listening on *:", PORT);
});

// 喚醒heroku
setInterval(() => {
  const url = `https://viaje9.com/wakeUp`;
  request.get(url, (err, res, body) => console.log(body));
}, 25 * 60 * 1000);

module.exports = http;
