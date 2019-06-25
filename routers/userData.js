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

const User = require('../models/user.js').User;

router.post('/userdata', (req, res) => {
    jwt.verify(req.body.token, 'aHKrColYbxT1Dg5mbtv42KKVU5lju6t0TopW8-E3Q-0', (err, decoded) => {
        if (err) return console.log(err);
        console.log(decoded._id);
        return User.findById(decoded._id, (err, userData) => {
            if (err) return console.log(err);
            console.log(userData);
            res.json(userData);
        });
    });
});

router.get('/alluserdata', (req, res) => {
    User.find((err, data) => {
        if (err) return console.log(err);
        res.json(data);
    });
});

module.exports = {
    router
}