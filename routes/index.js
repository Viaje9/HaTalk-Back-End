const express = require('express');
const Router = express.Router();
const ChatCtrl = require('../controller/ChatCtrl')
const Auth = require('../auth/token')

Router.get('/CheckAccount', ChatCtrl.checkAccount)
Router.post('/Login', ChatCtrl.login)
Router.get('/Logout', ChatCtrl.logout)
Router.post('/Register', ChatCtrl.register)
Router.get('/GetUser', Auth, ChatCtrl.getUser)
Router.put('/UpdateUserName', Auth, ChatCtrl.updateUserName)
Router.put('/UpdateUserState', Auth, ChatCtrl.updateUserState)
Router.get('/SearchUser', Auth, ChatCtrl.searchUser)
Router.post('/AddFriend', Auth, ChatCtrl.addFriend)
Router.get('/GetMsg', Auth, ChatCtrl.getMsg)
Router.get('/wakeUp', ChatCtrl.wakeUp)

module.exports = Router;