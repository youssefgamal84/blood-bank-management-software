const express = require("express");
const router = express.Router();
const { authNurse } = require("../middleware/authorization");
const _ = require("lodash");
const db = require("../db/appointment-queries");
const callback = require("./standardCallback");

router.post("/add", (req, res) => {
    var appointment = _.pick(req.body, ["ssn", "day", "hour", "name", "email"]);
    if (!appointment.ssn || !appointment.day || !appointment.hour || !appointment.name || !appointment.email) {
        res.status(400).send({ errorMessage: "Missing data" });
    }
    db.addAppointment(appointment, callback(req, res));
});





module.exports = router;