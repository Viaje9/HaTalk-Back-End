const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const key = require('./db');
const User = require('./model/User');
const Chat = require('./model/Chat');

mongoose.connect(key.db, { useNewUrlParser: true, useUnifiedTopology: true });

const userData1 = {
    account: "Account1",
    name: "nick",
    password: "*******"
}

const userData2 = {
    account: "Account2",
    name: "jack",
    password: "*******"
}

const userData3 = {
    account: "Account3",
    name: "Danny",
    password: "*******"
}


function fun1() {
    User.create(userData1, (err, user) => {
        if (err) return handleError(err)
        console.log("create User1 OK");
    })
}

function fun2() {
    User.create(userData2, (err, user) => {
        if (err) return handleError(err)
        console.log("create User2 OK");
    })
}

function fun3() {
    User.create(userData3, (err, user) => {
        if (err) return handleError(err)
        console.log("create User3 OK");
    })
}

// fun1()
// fun2()
// fun3()



/**新增好友 */
const user1 = "Account1"
const user2 = "Account2"
// User.findOne({ account: userAccount }, (err, res) => {
//     User.updateOne({ account: friendAccount }, { $push: { friends: res._id } }, (err, res) => {
//         if (err) return handleError(err)
//         console.log("ok");
//     })
// })
const newChat = new Chat()
creatFriend(user1, user2)
creatFriend(user2, user1)
newChat.save()

function creatFriend(user, friend) {
    User.findOne({ account: user }, (err, res) => {
        const data = {
            friends: res._id,
            chatList: {
                friend: res.account,
                chat: newChat._id
            }
        }
        User.updateOne({ account: friend }, { $push: data }, (err, res) => {
            if (err) return handleError(err)
            console.log("ok");
        })
    })
}

/**聊天室 */
// const newChat = new Chat()
// console.log(newChat._id);
// newChat.save()

/**搜索好友清單 */
// const userAccount = "Account1"
// User.findOne({ account: userAccount }).populate('friends').exec(function (err, res) {
//     const list = res.friends.map(e => { return {account:e.account,name:e.name,state:e.state} })
//     console.log(list);
// })

/**刪除好友 */
// const userAccount = "Account1"
// const friendAccount = "Account2"
// User.findOne({ account: friendAccount }, (err, friend) => {
//     if (err) return handleError(err)
//     User.updateOne({ account: userAccount }, { $pull: { friends:  friend._id} }, (err, res) => {
//         if (err) return handleError(err)
//         console.log("ok");
//     })
// })




/**
 * 新增使用者時新增聊天室清單
 * 加入好友時將兩個人的聊天室清單加入聊天室
 */