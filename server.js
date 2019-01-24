const express = require('express');
const bp = require("body-parser");
const {isEmail, isLength} = require("validator");
const mysql = require("mysql");
const db = require("./db");
const _ = require("lodash");


var app = express();

app.use(bp.json());

app.post("/users", (req, res) => {
    var user = _.pick(req.body, ["email", "password"]);
    
    if (!isEmail(user.email)) {
        return res.status(400).send({ errorMessage: "Please insert a valid email!" });
    };
    if (!user.password || isLength(user.password, { min: 0, max: 8 })) {
        return res.status(400).send({ errorMessage: "The password is too short!" });
    };

    db.addUser(user,(errorMessage,statusCode)=>{
        if(errorMessage){
            return res.status(statusCode).send({errorMessage});
        }
        return res.status(200).send();
    })
});

app.listen(3333, () => {
    console.log("Server started on port 3333");
})

