const express = require('express'); 
const router = express.Router();
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dischat', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const User = require('./../models/user.js').User;
const Message = require('./../models/message.js').Message;

const io = require('socket.io')(5000);

io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
});




// TODO: Socket.IO




router.post('/chat-submit-message', (req, res) => {
    console.log(req.body);
    jwt.verify(req.body.token, 'aHKrColYbxT1Dg5mbtv42KKVU5lju6t0TopW8-E3Q-0', (err, decoded) => {
        if (err) return console.log(err);
        db.collection('messages').insertOne(new Message({userid: decoded._id, date: new Date(req.body.date), message: req.body.message}));
    });
    io.emit('message', req.body);
    res.sendStatus(200);
});

router.get('/chat-messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

// db.collection('messages').insertOne(new Message({userid: '5d1235068e6b790b4c3a1c76', date: new Date(), message: 'Yet another message'});

module.exports = {
    router
}