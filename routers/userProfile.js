const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dischat', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const User = require('../models/user.js').User;

const multer = require('multer');
const mime = require('mime-types');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'users', 'profile'));
    },
    filename: (req, file, cb) => {
        // console.log(file);
        console.log(req.body);
        jwt.verify(req.body.token, 'aHKrColYbxT1Dg5mbtv42KKVU5lju6t0TopW8-E3Q-0', (err, decoded) => {
            cb(null, decoded._id + '.' + mime.extension(file.mimetype));
        })
    }
});

const upload = multer({ storage: storage });

router.post('/userProfileImage', upload.single('image'), (req, res) => {
    jwt.verify(req.body.token, 'aHKrColYbxT1Dg5mbtv42KKVU5lju6t0TopW8-E3Q-0', (err, decoded) => {
        if (err) return console.log(new Error(err));
        User.findById(decoded._id, (err, userData) => {
            if (err) return console.log(new Error(err));
            userData.image = 'images/users/profile/' + req.file.filename;
            userData.save( (err) => {
                if (err) return console.log(new Error(err));
            });
        })
    });
    res.redirect('/chat');
});



module.exports = {
    router
}