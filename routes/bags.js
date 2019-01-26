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

    db.addBag(bag, (errorMessage, statusCode) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }

        res.status(200).send();
    });
});

router.get("/expired", authNurse, (req, res) => {
    db.getExpiredBags((errorMessage, statusCode, expiredBags) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }

        res.send({ expiredBags });
    });
});

router.get("/:type", authNurse, (req, res) => {
    var type = req.params.type;
    if (!(["A", "B", "AB", "O"].includes(type))) {
        return res.status(400).send({ errorMessage: "invalid blood type" });
    }
    db.getBagsOfType(type, (errorMessage, statusCode, bags) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }

        res.status(200).send({ bags });
    });
});

router.delete("/:id", authNurse, (req, res) => {
    var id = req.params.id;
    db.deleteBagById(id, (errorMessage, statusCode) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }

        res.send();
    });
});





module.exports = router;