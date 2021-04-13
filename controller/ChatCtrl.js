// const Chatroom = require('../model/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const User = require("../model/User");
const Chat = require("../model/Chat");
require("dotenv").config();

dayjs.extend(utc);
dayjs.extend(timezone);

class IndexCtrl {
  async login(req, response) {
    const { account, password } = req.body;
    const userData = await User.findOne({ account });
    if (userData) {
      const verifyPassword = await bcrypt.compare(password, userData.password);
      if (verifyPassword) {
        const token = jwt.sign({ _id: account }, process.env.jwt, {
          expiresIn: "14 day"
        });
        const maxAge = 14 * 24 * 60 * 60 * 1000;
        const cookieConfig = {
          httpOnly: true,
          maxAge: maxAge
        };
        if (process.env.NODE_ENV === "production") {
          cookieConfig.sameSite = "none";
          cookieConfig.secure = true;
          cookieConfig.domain = ".viaje9.com";
        }
        response.cookie("Token", token, cookieConfig);
        response.json({ success: true });
        return;
      }
    }

    response.json({ success: false });
  }

  async logout(req, response) {
    response.clearCookie("Token");
    response.json({ success: true });
  }

  async checkAccount(req, res) {
    const account = await User.find({ account: req.query.account });
    res.send(account.length > 0 ? false : true);
  }

  //待優化
  async register(req, res) {
    //加密
    req.body.password = await bcrypt.hash(
      req.body.password,
      parseInt(process.env.saltRounds)
    );
    //搜索帳號
    const account = await User.find({ account: req.body.account });
    //不要相信前端傳進來的東西(寫驗證)
    //檢查帳號是否重複
    if (account.length <= 0) {
      //新增使用者
      const newUser = await User.create(req.body);
      //新增token
      const token = jwt.sign({ _id: req.body.account }, process.env.jwt, {
        expiresIn: "14 day"
      });
      const maxAge = 14 * 24 * 60 * 60 * 1000;
      const cookieConfig = {
        httpOnly: true,
        maxAge: maxAge
      };
      if (process.env.NODE_ENV === "production") {
        cookieConfig.sameSite = "none";
        cookieConfig.secure = true;
        cookieConfig.domain = ".viaje9.com";
      }
      res.cookie("Token", token, cookieConfig);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  }

  async getUser(req, res) {
    //取得好友名單就好
    await User.findOne({ account: req.account })
      .populate("friends")
      .exec(function (err, result) {
        const data = {
          success: true,
          name: result.name,
          account: result.account,
          friends: result.friends.map((e) => {
            return { name: e.name, state: e.state, account: e.account };
          })
        };
        res.json(data);
      });
  }

  updateUserName(req, res) {
    User.updateOne(
      { account: req.account },
      { name: req.body.name },
      (err, result) => {
        if (err) res.send({ success: false });
        res.send({ success: true });
      }
    );
  }

  updateUserState(req, res) {
    User.updateOne(
      { account: req.account },
      { state: req.body.state },
      (err, result) => {
        if (err) res.send({ success: false });
        res.send({ success: true });
      }
    );
  }

  searchUser(req, res) {
    User.findOne(
      { account: req.query.account },
      "account name state",
      (err, result) => {
        if (err || result === null) res.send({ success: false });
        else {
          const data = {
            account: result.account,
            name: result.name,
            state: result.state
          };
          res.send({ success: true, user: data });
        }
      }
    );
  }

  async addFriend(req, res) {
    const userAccount = req.account;
    const addAccount = req.body.account;
    await User.findOne({ account: userAccount })
      .populate("friends")
      .exec(async (err, result) => {
        const repeat = result.friends.filter((e) => e.account === addAccount);
        // 如果沒有此好有 且使用者帳號不等於要新增的帳號
        if (repeat.length === 0 && userAccount !== addAccount) {
          const newChat = new Chat();
          creatFriend(userAccount, addAccount, newChat._id);
          creatFriend(addAccount, userAccount, newChat._id);
          await newChat.save();
          res.send({ success: true });
        } else res.send({ success: false });
      });

    async function creatFriend(user, friend, chatId) {
      await User.findOne({ account: user }, async (err, userRes) => {
        const data = {
          friends: userRes._id,
          chatList: {
            friend: userRes.account,
            chat: chatId
          }
        };
        await User.updateOne({ account: friend }, { $push: data }).exec();
      });
    }
  }

  async getMsg(req, response) {
    const room = await User.findOne(
      { account: req.account },
      { chatList: { $elemMatch: { friend: req.query.account } } }
    );
    Chat.findOne({ _id: room.chatList[0].chat }, function (err, res) {
      response.json(res.record);
    });
  }

  wakeUp(req, response) {
    const time = dayjs()
      .tz("Asia/Taipei")
      .format("現在時間：YYYY年MM月DD日 HH點mm分");
    response.send(time);
  }
}

module.exports = new IndexCtrl();

//可能可以優化
