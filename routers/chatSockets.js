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
    socket.on('newUserLogin', (userLoginToken) => {
        jwt.verify(userLoginToken, 'aHKrColYbxT1Dg5mbtv42KKVU5lju6t0TopW8-E3Q-0', (err, decoded) => {
            if (err) return console.log(err);
            console.log(decoded._id + ' connected');
            socket.broadcast.emit('newUserLoginAnouncement', decoded._id);
        });
    });

    socket.on('submitChatMessage', (token, date, message) => {
        jwt.verify(token, 'aHKrColYbxT1Dg5mbtv42KKVU5lju6t0TopW8-E3Q-0', (err, decoded) => {
            if (err) return console.log(err);
            db.collection('messages').insertOne(new Message({userid: decoded._id, date: new Date(date), message: message}));
            User.findById(decoded._id, (err, userData) =>  {
                if (err) return console.log(err);
                socket.broadcast.emit('receiveChatMessage', userData.username, message, date);
            });
        });
    });

    socket.on('disconectParameters', (disconnectedUserToken) => {
        jwt.verify(disconnectedUserToken, 'aHKrColYbxT1Dg5mbtv42KKVU5lju6t0TopW8-E3Q-0', (err, decoded) => {
            if (err) return console.log(err);
            console.log(decoded._id + ' disconnected');
            socket.broadcast.emit('userDisconected', decoded._id);
        });
    });
});

module.exports = {
    router
}