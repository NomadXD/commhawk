const express = require("express");
const app = express();
const govRouter = require("./service.routes");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/gov",govRouter);

module.exports = app;