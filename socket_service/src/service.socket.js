module.exports = function (io) {

    const broadcastChannel = io.of('/broadcast');    


    broadcastChannel.on('connection', function (socket) {
        socket.emit('connected', { hello: 'world' });
        socket.on('my other event', function (data) {
          console.log(data);
        });
        
      });

    return broadcastChannel



}