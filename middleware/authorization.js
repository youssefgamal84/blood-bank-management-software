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
    console.log("AUTH NURSE");
    token = req.headers['x-auth'];
    console.log(token);
    jwt.verify(token, SECRET, {}, (err, decodedUser) => {

        if (err) {
            return res.status(401).send();
        }
        if (decodedUser.job !== constants.USER_NURSE) {
            console.log(decodedUser);
            return res.status(401).send();
        }

        req.nurseEmail = decodedUser.email;
        next();
    });
};

var authTech = (req, res, next) => {
    console.log("AUTH TECH");
    token = req.get('x-auth');
    jwt.verify(token, SECRET, {}, (err, decodedUser) => {

        if (err) {
            return res.status(401).send();
        }
        if (decodedUser.job !== constants.USER_TECH) {
            console.log(decodedUser);
            return res.status(401).send();
        }

        req.techEmail = decodedUser.email;
        next();
    });
};

module.exports = {
    authAdmin,
    authNurse,
    authTech
}