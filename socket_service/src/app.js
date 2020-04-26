var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http,{
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  });


const socketConnection = require("./service.socket");
const rethinkDB = require("./service.rethinkdb");

const bodyParser = require("body-parser");
const socketRouter = require("./service.routes");
const broadcastChannel = socketConnection.getBroadcastChannel(io);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

rethinkDB.initiateRealTimeDB(broadcastChannel);

app.use(function(req,res,next){
  req.broadcastChannel = broadcastChannel;
  next();
});

app.use("/api/socket",socketRouter);

//socketConnection.initiatePeriodicBroadcast(io);

module.exports = http;