const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const http = require("../server");
const socketIo = require("socket.io");
const User = require("../model/User");
const Chat = require("../model/Chat");
require("dotenv").config();

const io = socketIo(http, {
  cors: {
    origin: process.env.origin.split(" "),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    transports: ['websocket', 'polling'],
    allowedHeaders: ["Content-Type"],
    credentials: true
  },
  allowEIO3: true
})

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    const data = {
      user: socket.account,
      text: msg,
      time: Date.now()
    };
    Chat.updateOne({ _id: socket.room }, { $push: { record: data } }).exec();
    io.to(socket.room).emit("chat message", data);
  });

  socket.on("bind room", async (msg) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    if (cookies.Token) {
      socket.account = jwt.verify(cookies.Token, process.env.jwt)._id;
      const room = await User.findOne(
        { account: socket.account },
        { chatList: { $elemMatch: { friend: msg } } }
      );
      socket.room = room.chatList[0].chat.toString();
      socket.friend = msg;
      socket.join(socket.room);
    }
  });
});
