const mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '4264415',
    database: 'BBMS'
});

module.exports = connection;