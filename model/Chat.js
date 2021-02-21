const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Chat', new mongoose.Schema({
    record: [{
        user: String,
        text: String,
        time: {
            type: Date,
            default: Date.now
        }
    }]
}));

/**
 * 使用者要怎麼找到這張表
 * 不考慮多人聊天室
 */