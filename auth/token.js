const jwt = require('jsonwebtoken')
const key = require('../db');

module.exports = function (req, res, next) {
    try {
        req.account = jwt.verify(req.cookies.Token, key.jwt)._id
        next()
    } catch {
        res.send({ success: false })
    }    
}

