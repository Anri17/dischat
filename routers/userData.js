const express = require('express'); 
const router = express.Router();
const jwt = require('jsonwebtoken');
const tokenConfig = require('./../config/tokenConfig.js');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dischat', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const User = require('../models/user.js').User;

router.post('/thisuserdata', (req, res) => {
    console.log(req.body.token);
    jwt.verify(req.body.token, tokenConfig.secret, (err, decoded) => {
        if (err) return console.log(err);
        return User.findById(decoded._id, (err, userData) => {
            if (err) return console.log(err);
            res.json(userData);
        });
    });
});

router.post('/userdata', (req, res) => {
    User.findById(req.body.id, (err, userData) => {
        if (err) return console.log(err);
        res.json(userData);
    });
})

router.get('/alluserdata', (req, res) => {
    User.find((err, data) => {
        if (err) return console.log(err);
        res.json(data);
    });
});

module.exports = {
    router
}