const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dischat', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const User = require('./../models/user.js').User;

let userData;

// Login user
router.post('/login-user', (req, res) => {
    return getUserData(req.body.email, (err, doc) => {
        if (err) return res.json(err.message);
        bcrypt.compare(req.body.password, doc.password, (err, passwordIsEqual) => {
            if (err) return res.send(err);
            if (passwordIsEqual) {
                userData = JSON.stringify(doc);
                return res.redirect('/chat');
            }
            if (!passwordIsEqual) return res.send("password is not correct");
        });
    });
});

// Functions
function getUserData(email, callback) {
    return User.findOne({ email: email }, (err, doc) => {
        if (err) return callback(err);
        if (!doc) return callback(new Error('User not found!'));
        return callback(null, doc);
    });
}

module.exports = {
    router,
    userData
}