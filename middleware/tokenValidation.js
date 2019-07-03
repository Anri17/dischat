let jwt = require('jsonwebtoken');
const tokenConfig = require('./../config/tokenConfig.js');

let checkToken = (req, res, next) => {
    let token = req.headers; // Express headers are auto converted to lowercase

    console.log(req.headers);
    if (token) {
        jwt.verify(token, tokenConfig.secret, (err, decoded) => {
        if (err) {
            return res.json({
            success: false,
            message: 'Token is not valid'
            });
        } else {
            req.decoded = decoded;
            next();
        }
        });
    } else {
        return res.json({
        success: false,
        message: 'Auth token is not supplied'
        });
    }
};

module.exports = {
  checkToken: checkToken
}