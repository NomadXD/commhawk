const express = require('express')
const app = express()
const userRouter = require('./service.routes')

app.use('/api/user',userRouter);

module.exports = app;