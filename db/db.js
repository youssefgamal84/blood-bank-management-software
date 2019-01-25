const mysql = require('mysql');
const PASSWORD = require("./password");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: PASSWORD,
    database: 'BBMS'
});

module.exports = connection;