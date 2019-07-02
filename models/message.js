const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user.js').User;

const messageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    message: {
        type : String,
        required: true
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = {
    Message
}