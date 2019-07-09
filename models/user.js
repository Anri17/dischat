const mongoose = require('mongoose');

const Message = require('./message.js').Message;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type : String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: 'images/defaultProfile.png',
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}