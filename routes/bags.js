const express = require("express");
const router = express.Router();
const { authNurse } = require("../middleware/authorization");
const _ = require("lodash");
const db = require("../db/bag-queries");


router.post("/add", authNurse, (req, res) => {
    var bag = _.pick(req.body, ["rh", "type", "dssn"]);
    if (!(["A", "B", "AB", "O"].includes(bag.type))) {
        return res.status(400).send({ errorMessage: "invalid blood type" });
    }
    bag.email = req.nurseEmail;

    db.addBag(bag);


});



module.exports = router;