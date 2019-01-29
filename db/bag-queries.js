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

var getBagsOfType = (type, callback) => {
    connection.query('SELECT type, dssn , rh , id , e_date, e_email FROM bags WHERE type= ? AND used=0 AND valid=1 AND DATE(e_date)>CURDATE()', [type], (err, result) => {
        if (err) {
            return callback("unknown error happened", 500);
        }
        callback(undefined, undefined, result);
    })
};

var deleteBagById = (id, callback) => {
    connection.query('DELETE FROM bags WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            return callback("unknown error happened", 500);
        }
        if (result.affectedRows === 0) {
            return callback("no bag exist", 404);
        }
        callback();
    });
};

var getExpiredBags = (callback) => {
    connection.query('SELECT * FROM bags WHERE DATE(e_date)<=CURDATE() OR valid=0', (err, result) => {
        if (err) {
            console.log(err);
            return callback("unknown error happened", 500);
        }

        callback(undefined, undefined, result);
    });

};

var getUnsampledBags = (callback) => {
    connection.query('SELECT * FROM bags WHERE sampled=0', (err, result) => {
        if (err) {
            console.log(err);
            return callback("unknown error happened", 500);
        }

        callback(undefined, undefined, result);
    });

};

var setSampledById = (id, callback) => {
    connection.query('UPDATE bags SET sampled= ? WHERE id= ? ', [true, id], (err, result) => {
        if (err) {
            console.log(err);
            return callback("unknown error happened", 500);
        }
        if (result.affectedRows === 0) {
            return callback("no bag exist", 404);
        }

        callback();
    });
};

var addTest = (id, test, callback) => {
    connection.query('INSERT INTO tests(hiv,hepb,hepc,syph,t_email,bid) VALUES( ? , ? , ? , ? , ? , ? )',
        [test.hiv, test.hepb, test.hepc, test.syph, test.email, id], (err, result) => {
            if (err) {
                if (err.code == "ER_NO_REFERENCED_ROW_2") {
                    return callback("this id doesn't exist", 400);
                }
                if (err.code == "ER_DUP_ENTRY") {
                    return callback("this id is already in the results", 400)
                }
                console.log(err);
                return callback("unknown error happened", 500);
            }
            var valid = (test.hiv + test.hepb + test.hepc + test.syph) === 0;

            connection.query('UPDATE bags SET valid = ? WHERE id = ?', [valid, id], (err, result) => {
                if (err) {
                    console.log(err);
                    return callback("unknown error happened", 500);
                }
                callback();
            });
        })
};

var addReceiving = (receiving, callback) => {
    connection.query('INSERT INTO receive(pssn,bid,doctor_id,n_email) VALUES ( ? , ? , ? , ?)',
        [receiving.pssn, receiving.bid, receiving.doctor_id, receiving.email], (err, result) => {
            if (err) {
                if (err.code == "ER_NO_REFERENCED_ROW_2") {
                    return callback("this id doesn't exist", 400);
                }
                if (err.code == "ER_DUP_ENTRY") {
                    return callback("this id is already in the receivings", 400)
                }
                console.log(err);
                return callback("unknown error happened", 500);
            }

            connection.query('UPDATE bags SET used = 1 WHERE id = ?', [receiving.bid], (err, result) => {
                if (err) {
                    console.log(err);
                    return callback("unknown error happened", 500);
                }

                callback();
            });
        });
};

var setComplications = (id, callback) => {
    connection.query('UPDATE receive SET complications=1 WHERE bid = ? ', [id], (err, result) => {
        if (err) {
            console.log(err);
            return callback("unknown error happened", 500);
        }
        if (result.affectedRows === 0) {
            return callback("no bag exist", 404);
        }

        callback();
    });
};


module.exports = {
    addBag,
    getBagsOfType,
    deleteBagById,
    getExpiredBags,
    setSampledById,
    addTest,
    addReceiving,
    setComplications,
    getUnsampledBags
}