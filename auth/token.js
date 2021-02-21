const jwt = require('jsonwebtoken')
require("dotenv").config();

module.exports = function (req, res, next) {
    try {
        req.account = jwt.verify(req.cookies.Token, process.env.jwt)._id
        next()
    } catch {
        res.send({ success: false })
    }    
}

