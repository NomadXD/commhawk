const express = require('express')
const app = express()
const test = require('./service.controller')


app.get('/test',async (req,res) => {
  await test()
})

module.exports = app;