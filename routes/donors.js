const express = require("express");
const router = express.Router();
const db = require("../db/donor-queries");
const _ = require("lodash");
const { authNurse } = require("../middleware/authorization");

var checkDonor = (req, res, next) => {
    var donor = _.pick(req.body, ["name", "ssn", "sex", "bdate", "weight", "email", "address", "telephone"]);
    if (!donor.name || !donor.ssn || !donor.weight || !donor.email || !donor.address || !donor.telephone || !donor.bdate || donor.sex === null || donor.sex === undefined) {
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
});

router.get("/", authNurse, (req, res) => {
    db.getAllDonors((errorMessage, statusCode, donors) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }

        res.send({ donors });
    });
});

router.post("/history/:ssn", (req, res) => {
    var SSN = req.params.ssn;
    var history = req.body.history;

    if (!(history.constructor === Array)) {
        return res.status(400).send({ errorMessage: "invalid data" });
    }

    db.getDonorBySSN(SSN, (errorMessage, statusCode, donorInfo) => {
        if (!donorInfo) {
            return res.status(400).send({ errorMessage: "this SSN doesn't exist" });
        }
        var queries = history.length;
        history.forEach(e => {
            db.insertHistory(SSN, e, (errorMessage, statusCode) => {
                if(queries<0) return;
                if (errorMessage) {
                    queries =-1;
                    return res.status(statusCode).send({ errorMessage });
                }
                queries--;
                if (queries === 0) {
                    res.status(200).send();
                }

            });
        });



    })
});

module.exports = router;