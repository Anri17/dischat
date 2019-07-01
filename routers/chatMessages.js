const express = require('express'); 
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dischat', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const User = require('./../models/user.js').User;
const Message = require('./../models/message.js').Message;

router.get('/chat-messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

// Quick Reset Messages
// Message.deleteMany({}, ()=> {console.log('Messages Reset');});

module.exports = {
    router
}