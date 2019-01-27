const express = require("express");
const router = express.Router();
const { authTech } = require("../middleware/authorization");
const _ = require("lodash");
const db = require("../db/bag-queries");
const callback = require("./standardCallback");

router.post("/sample/:id", authTech, (req, res) => {
    var id = req.params.id;
    db.setSampledById(id, callback(req, res));
});

router.post("/test/:id", authTech, (req, res) => {
    var id = req.params.id;
    var test = _.pick(req.body, ["hiv", "hepb", "hepc", "syph"]);
    var validOptions = [0, 1];
    if (!(validOptions.includes(test.hiv) && validOptions.includes(test.hepb) && validOptions.includes(test.hepc) && validOptions.includes(test.syph))) {
        return res.status(400).send({ errorMessage: "Data invalid" });
    }

    test.email = req.techEmail;

    db.addTest(id, test, callback(req, res));
});


module.exports = router;
