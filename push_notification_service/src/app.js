const express = require("express");
const app = express();
const pushRouter = require("./service.routes");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/push",pushRouter);

module.exports = app;