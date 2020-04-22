const express = require('express');
const http = require('http')
const app = express();
const route = require('./alert.routes.js');

app.use(express.urlencoded( { extended : false}));

var server = http.createServer(app);

app.use('/api/alert',route)


module.exports = server;