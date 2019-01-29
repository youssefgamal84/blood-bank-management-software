const connection = require("./db");
const bcrypt = require('bcryptjs');

var addUser = (user, callback) => {

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return callback("unknown error happened");
            }

            connection.query('INSERT INTO users(email,password,name,ssn,job,sex) VALUES (? ,?, ?, ?, ?, ? )',
                [user.email, hash, user.name, user.ssn, user.job, user.sex], (err, result) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            callback("This E-mail or SSN Already exists!", 400);
                        }
                        else {
                            callback("Unknown Error Happened!", 500);
                        }
                        console.log(err);

                    }
                    else
                        callback();
                });
        });
    });
};

var checkUser = (user, callback) => {
    connection.query('SELECT * FROM users WHERE email= ? ;', [user.email], (err, result) => {
        if (err) {
            return callback("unkown error happened", 500, false);
        }

        if (result.length === 0) {
            return callback("This Email is not registered", 400, false);
        }
        hashedPassword = result[0].password;
        bcrypt.compare(user.password, hashedPassword).then((isMatched) => {
            if (!isMatched) {
                return callback("The password is wrong", 401, false);
            }
            callback(undefined, 200, result[0]);
        }).catch((e) => {
            if (e) {
                return callback("unknown error happened", 500, false);
            }
        });
    });
};

var removeUserByEmail = (email, callback) => {
    connection.query('DELETE FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            return callback("unknown error happened", 500);
        }
        if (result.affectedRows === 0) {
            return callback("This email doesn't exist!", 400)
        }

        callback();

    });
}


module.exports = {
    addUser,
    checkUser,
    removeUserByEmail
}