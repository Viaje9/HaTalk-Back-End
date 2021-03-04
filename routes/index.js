const express = require('express');
const Router = express.Router();
const IndexCtrl = require('../controller/FrontCtrl')
const Auth = require('../auth/token')

Router.get('/CheckAccount', IndexCtrl.checkAccount)
Router.post('/Login', IndexCtrl.login)
Router.get('/Logout', IndexCtrl.logout)
Router.post('/Register', IndexCtrl.register)
Router.get('/GetUser', Auth, IndexCtrl.getUser)
Router.put('/UpdateUserName', Auth, IndexCtrl.updateUserName)
Router.put('/UpdateUserState', Auth, IndexCtrl.updateUserState)
Router.get('/SearchUser', Auth, IndexCtrl.searchUser)
Router.post('/AddFriend', Auth, IndexCtrl.addFriend)
Router.get('/GetMsg', Auth, IndexCtrl.getMsg)
Router.get('/wakeUp', IndexCtrl.wakeUp)

module.exports = Router;