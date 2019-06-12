const express = require('express');
const router = express.Router();
const io = require('socket.io')(5000);

const loginData = require('./login.js').userData;

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dischat', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const User = require('./../models/user.js').User;



let users = {}

io.on('connection', (socket) => {
    // Send Receive Test
    socket.on('newUserLogin', (newUserLogin) => {
        console.log(users[socket.id] + ' connected');
        users[socket.id] = newUserLogin;
        socket.broadcast.emit('newUserLoginAnouncement', newUserLogin);
    });

    socket.on('chatMessageSubmit', (message) => {
        socket.broadcast.emit('chatMessage', message, users[socket.id]);
        console.log(message);
    });

    // User Disconect
    socket.on('disconnect', () => {
        console.log(users[socket.id] + ' disconnected');
        socket.broadcast.emit('userDisconected', users[socket.id]);
    });
});

function gatherUserList(email, callback) {
    return User.findOne({ email: email }, (err, doc) => {
        if (err) return callback(err);
        if (!doc) return callback(new Error('User not found!'));
        return callback(null, doc);
    });
}

module.exports = {
    router
}