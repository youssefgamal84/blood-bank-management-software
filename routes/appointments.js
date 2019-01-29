const express = require("express");
const router = express.Router();
const { authNurse } = require("../middleware/authorization");
const _ = require("lodash");
const db = require("../db/appointment-queries");
const callback = require("./standardCallback");

router.post("/add", (req, res) => {
    var appointment = _.pick(req.body, ["day", "hour", "name", "email"]);
    if (!appointment.day || !appointment.hour || !appointment.name || !appointment.email) {
        return res.status(400).send({ errorMessage: "Missing data" });
    }
    db.addAppointment(appointment, callback(req, res));
});





module.exports = router;