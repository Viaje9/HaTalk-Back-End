const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http").createServer(app);
const index = require("./routes/index");

require("dotenv").config();

const corsOptions = {
  origin: ["http://www.example.com", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type"],
  credentials: true
};

mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(index);

http.listen(process.env.PORT || 8080, () => {
  console.log("listening on *:", process.env.PORT || 8080);
});

module.exports = http;
