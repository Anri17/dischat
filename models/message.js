const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: String,
        required: true,
    },
    message: {
        type : String,
        required: true,
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = {
    Message
}