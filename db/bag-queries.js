const connection = require("./db");


var addBag = (bag, callback) => {
    connection.query('INSERT INTO bags(rh,type,dssn,e_email) VALUES( ? , ? , ? , ?)', [bag.rh, bag.type, bag.dssn, bag.email], (err, result) => {
        if (err) {
            if (err.code == "ER_NO_REFERENCED_ROW_2") {
                return callback("this ssn doesn't exist", 400);
            }
            console.log(err);
            return callback("unknown error happened", 500);
        }

        callback();
    })
};


module.exports = {
    addBag
}