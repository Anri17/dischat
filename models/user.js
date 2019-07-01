const mongoose = require('mongoose');

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
        default: 'images/users/profile/default.png',
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}