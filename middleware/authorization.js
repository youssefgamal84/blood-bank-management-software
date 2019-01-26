const jwt = require('jsonwebtoken');
const SECRET = require("../secret");
const constants = require("../const-config")

var authAdmin = (req, res, next) => {
    token = req.get('x-auth');
    jwt.verify(token, SECRET, {}, (err, decodedUser) => {

        if (err) {
            return res.status(401).send();
        }
        if (decodedUser.job !== constants.USER_ADMIN) {
            console.log(decodedUser);
            return res.status(401).send();
        }

        next();
    });
};

var authNurse = (req, res, next) => {
    token = req.get('x-auth');
    jwt.verify(token, SECRET, {}, (err, decodedUser) => {

        if (err) {
            return res.status(401).send();
        }
        if (decodedUser.job !== constants.USER_NURSE) {
            console.log(decodedUser);
            return res.status(401).send();
        }

        next();
    });
};

module.exports = {
    authAdmin,
    authNurse
}