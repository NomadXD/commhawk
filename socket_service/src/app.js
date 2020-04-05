var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http,{
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  });

const bodyParser = require("body-parser");
const socketRouter = require("./service.routes")


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const broadcastChannel = require('./service.socket')(io)


app.use(function(req,res,next){
  req.socket = broadcastChannel;
  next();
});

app.use('/api/socket',socketRouter)


module.exports = http;