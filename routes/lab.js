const express = require("express");
const router = express.Router();
const { authTech } = require("../middleware/authorization");
const _ = require("lodash");
const db = require("../db/bag-queries");


router.post("/sample/:id", authTech, (req, res) => {
    var id = req.params.id;
    db.setSampledById(id, (errorMessage, statusCode) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }

        res.send();
    });
});

router.post("/test/:id", authTech, (req, res) => {
    var id = req.params.id;
    var test = _.pick(req.body, ["hiv", "hepb", "hepc", "syph"]);
    var validOptions = [0, 1];
    if (!(validOptions.includes(test.hiv) && validOptions.includes(test.hepb) && validOptions.includes(test.hepc) && validOptions.includes(test.syph))) {
        return res.status(400).send({ errorMessage: "Data invalid" });
    }

    test.email = req.techEmail;

    db.addTest(id, test, (errorMessage, statusCode) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }

        res.send();
    });
});


module.exports = router;
