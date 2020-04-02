const express = require("express");
const app = express();
const userRouter = require("./service.routes");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/user",userRouter);

module.exports = app;