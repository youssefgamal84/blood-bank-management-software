const connection = require("./db");


var addAppointment = (appointment, callback) => {
    connection.query('SELECT count(ssn) as c FROM appointment WHERE day = ? AND hour = ? ', [appointment.day, appointment.hour]
        , (err, result) => {
            if (err) {
                return callback("unknown error happened", 500);
            }
            var count = result[0].c;
            if (count > 30) {
                return callback("This appointment is currently busy please choose another", 400);
            }

            connection.query('INSERT INTO appointment(ssn,email,name,day,hour) VALUE( ? , ? , ? , ? , ?)',
                [appointment.ssn, appointment.email, appoint.name, appointment.day, appointment.hour], (err, result) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            return callback("This E-mail or SSN Already exists!", 400);
                        }
                        else {
                            console.log(err);
                            return callback("Unknown Error Happened!", 500);
                        }
                    }
                    else
                        callback();
                });
        })
};

module.exports = {
    addAppointment
}