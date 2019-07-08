const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dischat', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const User = require('./../models/user.js').User;

// Register new User
router.post('/register-user', (req, res) => {
    if (req.body.username == '') return res.json('no username');
    if (req.body.email == '') return res.json('no email');
    if (req.body.password == '') return res.json('no password');
    if (req.body.password != req.body.re_password) return res.json('password not equal');
    let newUser = new User({ username: req.body.username, email: req.body.email, password: undefined });
    return getEncriptedPassword(req.body.password, (err, hash) => {
        if (err) res.json(err);
        newUser.password = hash;
        return getDatabaseDuplicates(newUser, (err, existingUser) => {
            if (err) return res.json(err.message);
            if (newUser.email == existingUser.email) return res.json('email exists');
            if (newUser.username == existingUser.username) return res.json('username exists');
            return insertUserIntoDatabase(newUser, (err) => {
                if (err) return res.json(err.message);
                return res.json('success');
            });
        });
    });
});

// functions
function getEncriptedPassword(password, callback) {
    return bcrypt.genSalt(10, (err, salt) => {
        if (err) return callback(err);
        return bcrypt.hash(password, salt, (err, hash) => {
            if (err) return callback(err);
            return callback(null, hash);
        });
    });
}

function insertUserIntoDatabase(newUser, callback) {
    return db.collection('users').insertOne(newUser, (err) => {
        if (err) return callback(err);
        return callback(null);
    });
}

function getDatabaseDuplicates(newUser, callback) {
    return User.findOne({ email: newUser.email }, (err, doc) => {
        if (err) return callback(err);
        if (!doc) return User.findOne({ username: newUser.username }, (err, doc) => {
            if (err) return callback(err);
            if (!doc) return callback(null, {email: undefined, username: undefined});
            return callback(null, doc);
        });
        return callback(null, doc);
    });
}

module.exports = {
    router
}