const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: null
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    chatList: [{
        friend: String,
        chat: {
            type: Schema.Types.ObjectId,
            ref: 'Chat',
        }
    }],
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}));