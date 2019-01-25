const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { isEmail, isLength } = require("validator");
const db = require("../db/user-queries");
const _ = require("lodash");
const { authAdmin } = require("../authorization");
const SECRET = require("../secret");





router.post("/sign-up", authAdmin, (req, res) => {
    var user = _.pick(req.body, ["email", "password", "ssn", "name", "job", "sex"]);

    if (!isEmail(user.email)) {
        return res.status(400).send({ errorMessage: "Please insert a valid email!" });
    };
    if (!user.password || isLength(user.password, { min: 0, max: 8 })) {
        return res.status(400).send({ errorMessage: "The password is too short!" });
    };

    if (!user.ssn || !user.name || user.job === undefined || user.job === null || user.sex === undefined || user.sex === null) {
        console.log(user);
        return res.status(400).send({ errorMessage: "Missing Data!" })
    }

    db.addUser(user, (errorMessage, statusCode) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }
        return res.status(200).send();
    })
});

router.post("/login", (req, res) => {
    var user = _.pick(req.body, ["email", "password"]);
    if (!user.email || !user.password) {
        return res.status(400).send({ errorMessage: "missing data" });
    }

    db.checkUser(user, (errorMessage, statusCode, userAllAttributes) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }

        jwt.sign({ email: userAllAttributes.email, job: userAllAttributes.job }, SECRET, { expiresIn: "2h" }, (err, token) => {
            if (err) {
                return res.status(500).send({ errorMessage: "unknown server error happened!" });
            }
            res.status(200).send({ token });
        });
    });
});

router.delete("/:email", authAdmin, (req, res) => {
    var email = req.params.email;
    db.removeUserByEmail(email, (errorMessage, statusCode) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }

        res.status(200).send();
    });

});

module.exports = router;