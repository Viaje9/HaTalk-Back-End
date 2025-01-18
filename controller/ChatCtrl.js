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
  async login(req, res) {
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
        res.cookie("Token", token, cookieConfig);
        res.json({ success: true });
        return;
      }
    }

    res.json({ success: false });
  }

  async logout(req, res) {
    res.clearCookie("Token");
    res.json({ success: true });
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
      .exec().then((result) => {
        const data = {
          success: true,
          name: result.name,
          account: result.account,
          friends: result.friends.map((e) => {
            return { name: e.name, state: e.state, account: e.account };
          })
        };
        res.json(data);
      })
  }

  updateUserName(req, res) {
    User.updateOne({ account: req.account }, { name: req.body.name })
      .then(() => {
        res.send({ success: true });
      }).catch((err) => {
        res.send({ success: false });
      })
  }

  updateUserState(req, res) {
    User.updateOne({ account: req.account }, { state: req.body.state }).then(() => {
      res.send({ success: true });
    }).catch(() => {
      res.send({ success: false });
    })
  }

  searchUser(req, res) {
    User.findOne({ account: req.query.account }, "account name state").then(result => {
      if (result === null) {
        res.send({ success: false })
      } else {
        const data = {
          account: result.account,
          name: result.name,
          state: result.state
        };
        res.send({ success: true, user: data });
      }
    }).catch(() => {
      res.send({ success: false });
    })
  }

  async addFriend(req, res) {
    const userAccount = req.account;
    const addAccount = req.body.account;
    await User.findOne({ account: userAccount })
      .populate("friends")
      .exec().then(async (result) => {
        const repeat = result.friends.filter((e) => e.account === addAccount);
        // 如果沒有此好有 且使用者帳號不等於要新增的帳號
        if (repeat.length === 0 && userAccount !== addAccount) {
          const newChat = new Chat();
          creatFriend(userAccount, addAccount, newChat._id);
          creatFriend(addAccount, userAccount, newChat._id);
          await newChat.save();
          res.send({ success: true });
        } else res.send({ success: false });
      })

    async function creatFriend(user, friend, chatId) {
      const userRes = await User.findOne({ account: user });
      const data = {
        friends: userRes._id,
        chatList: {
          friend: userRes.account,
          chat: chatId
        }
      };
      await User.updateOne({ account: friend }, { $push: data }).exec()
    }
  }

  async getMsg(req, res) {
    const room = await User.findOne(
      { account: req.account },
      { chatList: { $elemMatch: { friend: req.query.account } } }
    );
    Chat.findOne({ _id: room.chatList[0].chat }).then((result) => {
      res.json(result.record);
    })
  }

  wakeUp(req, res) {
    const time = dayjs()
      .tz("Asia/Taipei")
      .format("現在時間：YYYY年MM月DD日 HH點mm分");
      res.send(time);
  }
}

module.exports = new IndexCtrl();

//可能可以優化
