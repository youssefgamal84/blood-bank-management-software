const express = require('express');
const bp = require("body-parser");
const userRoutes = require("./routes/users");
const donorRoutes = require("./routes/donors");
const bagRoutes = require("./routes/bags");
const labRoutes = require("./routes/lab");

var app = express();

app.use(bp.json());

app.use("/users", userRoutes);
app.use("/donors", donorRoutes);
app.use("/bags", bagRoutes);
app.use("/lab", labRoutes);

app.listen(3333, () => {
    console.log("Server started on port 3333");
})

