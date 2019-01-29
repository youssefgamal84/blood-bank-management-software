const express = require("express");
const router = express.Router();
const { authNurse, authTech } = require("../middleware/authorization");
const _ = require("lodash");
const db = require("../db/bag-queries");
const callback = require("./standardCallback");

router.post("/add", authNurse, (req, res) => {
    var bag = _.pick(req.body, ["rh", "type", "dssn"]);
    if (!(["A", "B", "AB", "O"].includes(bag.type))) {
        return res.status(400).send({ errorMessage: "invalid blood type" });
    }
    bag.email = req.nurseEmail;

    db.addBag(bag, callback(req, res))
});

router.get("/expired", authNurse, (req, res) => {
    db.getExpiredBags(callback(req, res, "expiredBags"));
});

router.post("/receive", authNurse, (req, res) => {
    var receiving = _.pick(req.body, ["pssn", "bid", "doctor_id"]);
    if (!receiving.pssn || !receiving.bid || !receiving.doctor_id) {
        return res.status(400).send({ errorMessage: "missing data" });
    }
    receiving.email = req.nurseEmail;
    db.addReceiving(receiving, callback(req, res));
});

router.patch("/set-complications/:id", authNurse, (req, res) => {
    db.setComplications(req.params.id, callback(req, res));
});

router.get("/:type", authNurse, (req, res) => {
    var type = req.params.type;
    if (!(["A", "B", "AB", "O"].includes(type))) {
        return res.status(400).send({ errorMessage: "invalid blood type" });
    }
    db.getBagsOfType(type, callback(req, res, "bags"));
});

router.delete("/:id", authNurse, (req, res) => {
    var id = req.params.id;
    db.deleteBagById(id, callback(req, res));
});

router.get("/unsampled", authTech, (req, res) => {
    db.getUnsampledBags(callback(req, res));
});





module.exports = router;