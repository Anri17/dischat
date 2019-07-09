const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const tokenConfig = require('./../config/tokenConfig.js');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const mongoose = require('mongoose');
const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dischat';
mongoose.connect(CONNECTION_URI, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const User = require('./../models/user.js').User;

// Login user
router.post('/login-user', (req, res) => {
    console.log(req.body);
    if (req.body.email == '') return res.json('empty email');
    if (req.body.password == '') return res.json('empty password');
    return getUserData(req.body.email, (err, doc, userExists) => {
        if (err) return res.json(err.message);
        if (!userExists) return res.json('no user');
        bcrypt.compare(req.body.password, doc.password, (err, passwordIsEqual) => {
            console.log(doc);
            if (err) return res.render(err);
            if (!passwordIsEqual) return res.json('wrong password');
            if (passwordIsEqual) {
                let token = jwt.sign({
                    _id: doc._id,
                }, tokenConfig.secret);
                res.json({
                    success: true,
                    token: token    // TODO: TOKEN VALIDATION WITHIN SERVER
                });
            };
        });
    });
});

// Functions
function getUserData(email, callback) {
    return User.findOne({ email: email }, (err, doc) => {
        if (err) return callback(err);
        if (!doc) return callback(null, null, false);
        return callback(null, doc, true);
    });
}

module.exports = {
    router,
}