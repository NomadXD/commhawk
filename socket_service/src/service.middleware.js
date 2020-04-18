const jwt = require("jsonwebtoken");

const socketJWTAuthentication = async (socket,next) => {
    if (socket.handshake.query && socket.handshake.query.token){
        jwt.verify(socket.handshake.query.token,"secret", function(err, decoded) {
          if(err) return next(new Error("Authentication error"));
          socket.decoded = decoded;
          next();
        });
      } else {
          next(new Error("Authentication error"));
      }    
};

module.exports = {socketJWTAuthentication};


