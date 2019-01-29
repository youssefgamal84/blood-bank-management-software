const express = require('express');
const bp = require("body-parser");
const cors = require('cors');
const userRoutes = require("./routes/users");
const donorRoutes = require("./routes/donors");
const bagRoutes = require("./routes/bags");
const labRoutes = require("./routes/lab");
const appointmentRoutes = require("./routes/appointments");

var whitelist = ['http://localhost:4200'];

var corsOptions = {
    origin: function (origin, callback) {
        console.log(origin);
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    exposedHeaders: 'x-auth'
};

var app = express();

app.use(bp.json());
app.use(cors(corsOptions))

app.use("/users", userRoutes);
app.use("/donors", donorRoutes);
app.use("/bags", bagRoutes);
app.use("/lab", labRoutes);
app.use("/appointments", appointmentRoutes);

app.listen(3333, () => {
    console.log("Server started on port 3333");
})

