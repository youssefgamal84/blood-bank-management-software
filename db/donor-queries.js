const connection = require("./db");

var addDonor = (donor, callback) => {
    connection.query('INSERT INTO donors(ssn,name,bdate,weight,sex,address,telephone,email) VALUE (? , ? , ? , ? , ? , ? , ? , ?)',
        [donor.ssn, donor.name, donor.bdate, donor.weight, donor.sex, donor.address, donor.telephone, donor.email],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return callback("This E-mail or SSN Already exists!", 400);
                }
                else {
                    return callback("Unknown Error Happened!", 500);
                }
            }

            callback();

        });
}

var getDonorBySSN = (SSN, callback) => {
    connection.query('SELECT * FROM donors WHERE ssn= ?', [SSN], (err, result) => {
        if (err) {
            return callback("Unknown error happened", 500);
        }
        if (result.length === 0) {
            return callback("No donor with this SSN exist", 400);
        }
        callback(undefined, undefined, result[0]);
    });
};

var updateDonorBySSN = (SSN, newDonor, callback) => {
    connection.query('UPDATE donors SET ssn= ? , name = ? , sex = ? , weight = ? , bdate = ? , address= ? , telephone = ? , email = ? WHERE ssn= ?',
        [newDonor.ssn, newDonor.name, newDonor.sex, newDonor.weight, newDonor.bdate, newDonor.address, newDonor.telephone, newDonor.email, SSN],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return callback("This E-mail or SSN Already exists!", 400);
                }
                console.log(err);
                return callback("Unknown error happened", 500);
            }
            console.log(result);
            callback();
        });
};

var getAllDonors = (callback) => {
    connection.query('SELECT * FROM donors', (err, result) => {
        if (err) {
            console.log(err);
            return callback("Unknown error Happened", 500);
        }

        callback(undefined, undefined, result);
    });
};

var insertHistory = (SSN, dCode, callback) => {
    connection.query('INSERT INTO history(dssn,code) VALUE( ? , ? )', [SSN, dCode], (err, result) => {
        if (err) {
           // console.log(err);
            return callback("unknown error happened", 500);
        }
        callback();
    });
}

module.exports = {
    addDonor,
    getDonorBySSN,
    updateDonorBySSN,
    getAllDonors,
    insertHistory
}