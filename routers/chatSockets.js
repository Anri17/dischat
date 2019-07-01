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

let connectedUsers = {};

function ioServer(io) {
    io.on('connection', (socket) => {
        socket.on('newUserLogin', (userLoginToken) => {
            jwt.verify(userLoginToken, 'aHKrColYbxT1Dg5mbtv42KKVU5lju6t0TopW8-E3Q-0', (err, decoded) => {
                if (err) return console.log(err);
                console.log(decoded._id + ' connected');
                for (const value of Object.values(connectedUsers)) {
                    if (decoded._id == value) {
                        return console.log('User already logged in');
                    }
                }
                connectedUsers[socket.id] = decoded._id;
                io.sockets.emit('newUserLoginAnouncement', connectedUsers);
                socket.emit('online');
                console.log(connectedUsers);
            });
        });

        socket.on('submitChatMessage', (token, date, message) => {
            jwt.verify(token, 'aHKrColYbxT1Dg5mbtv42KKVU5lju6t0TopW8-E3Q-0', (err, decoded) => {
                if (err) return console.log(err);
                User.findById(decoded._id, (err, userData) =>  {
                    db.collection('messages').insertOne(new Message({userid: decoded._id, username: userData.username, date: new Date(date), message: message}));
                    if (err) return console.log(err);
                    io.sockets.emit('receiveChatMessage', userData.username, date, message);
                });
            });
        });

        socket.on('disconnect', () => {
            console.log("disconnected");
            io.sockets.emit('userDisconnected', connectedUsers[socket.id]);
            console.log(connectedUsers[socket.id]);
            delete connectedUsers[socket.id];
            console.log(connectedUsers);
        })
    });
}

module.exports = {
    router,
    ioServer
}