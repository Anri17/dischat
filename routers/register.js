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

// Register new User
router.post('/register-user', (req, res) => {
    console.log(req);
    if (req.body.password == '') return res.send('Password field is empty');
    if (req.body.password != req.body.re_password) return res.send('Password fields are not equal');

    let newUser = new User({ username: req.body.username, email: req.body.email, password: undefined });
    return getEncriptedPassword(req.body.password, (err, hash) => {
        if (err) res.send(err);
        newUser.password = hash;
        return getDatabaseDuplicates(newUser, (err, existingUser) => {
            if (err) return res.json(err.message);
            if (newUser.email == existingUser.email) return res.push('Email already in use');
            if (newUser.username == existingUser.username) return res.send('Username already in use');
            return insertUserIntoDatabase(newUser, (err) => {
                if (err) return res.json(err.message);
                return res.send('New Register');
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