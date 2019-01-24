const mysql = require('mysql');
const bcrypt = require('bcryptjs');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '4264415',
    database: 'BBMS'
});

var addUser = (user, callback) => {

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return callback("unknown error happened");
            }

            connection.query('INSERT INTO users(email,password) VALUES (? ,? )', [user.email, hash], (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        callback("This E-mail Already exists!",400);
                    }
                    else {
                        callback("Unknown Error Happened!",500);
                    }
                    console.log(err);

                }
                else
                    callback();
            });
        });
    });
};


module.exports={
    addUser
}