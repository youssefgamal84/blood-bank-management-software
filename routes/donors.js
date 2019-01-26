const express = require("express");
const router = express.Router();
const db = require("../db/donor-queries");
const _ = require("lodash");
const { authNurse } = require("../middleware/authorization");

var checkDonor = (req, res, next) => {
    var donor = _.pick(req.body, ["name", "ssn", "sex", "age", "weight", "email", "address", "telephone"]);
    if (!donor.name || !donor.ssn || !donor.weight || !donor.email || !donor.address || !donor.telephone || !donor.age || donor.sex === null || donor.sex === undefined) {
        return res.status(400).send({ errorMessage: "missing data!" });
    }

    if (!(donor.sex === 0 || donor.sex === 1)) {
        return res.status(400).send({ errorMessage: "Provide a valid gender" });
    }

    req.donor = donor;
    next();
};

router.post("/add", authNurse, checkDonor, (req, res) => {
    var donor = req.donor;

    db.addDonor(donor, (errorMessage, statusCode) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }
        res.status(200).send();
    })
});

router.get("/:ssn", authNurse, (req, res) => {
    var ssn = req.params.ssn;
    db.getDonorBySSN(ssn, (errorMessage, statusCode, donorInfo) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }
        res.status(200).send({ donor: donorInfo });
    });
});

router.patch("/:ssn", authNurse, checkDonor, (req, res) => {
    var donor = req.donor;

    db.updateDonorBySSN(req.params.ssn, donor, (errorMessage, statusCode) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }

        res.send();
    });
})

module.exports = router;