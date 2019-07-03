const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const tokenConfig = require('./../config/tokenConfig.js');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dischat', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const User = require('./../models/user.js').User;
const Message = require('./../models/message.js').Message;

let connectedUsers = {};

function ioServer(io) {
    io.on('connection', (socket) => {
        socket.on('newUserLogin', (userLoginToken) => {
            jwt.verify(userLoginToken, tokenConfig.secret, (err, decoded) => {
                if (err) return console.log(err);
                console.log(decoded._id + ' connected');
                for (const value of Object.values(connectedUsers)) {
                    if (decoded._id == value) {
                        return console.log('User already logged in');
                    }
                }
                connectedUsers[socket.id] = decoded._id;
                io.sockets.emit('newUserLoginAnouncement', connectedUsers);
                Message.find().populate('user').sort({ date:1 }).exec((err, messages) => {
                    if (err) return console.log(new Error(err));
                    socket.emit('online', messages);;
                });
            });
            
        });

        socket.on('submitChatMessage', (token, date, message) => {
            jwt.verify(token, tokenConfig.secret, (err, decoded) => {
                if (err) return console.log(err);
                User.findById(decoded._id, (err, userData) =>  {
                    db.collection('messages').insertOne(new Message({user: decoded._id, date: new Date(date), message: message}));
                    if (err) return console.log(err);
                    io.sockets.emit('receiveChatMessage', userData.username, date, message, userData.image);
                });
            });
        });

        socket.on('disconnect', () => {
            console.log("a user has disconnected");
            io.sockets.emit('userDisconnected', connectedUsers[socket.id]);
            console.log(connectedUsers[socket.id]);
            delete connectedUsers[socket.id];
            console.log(connectedUsers);
        });

        socket.on('deleteMessages', () => {
            Message.deleteMany({}, ()=> {console.log('DEBUG: messages deleted');});
            io.sockets.emit('deleteMessages');
        });
    });
}

module.exports = {
    router,
    ioServer
}