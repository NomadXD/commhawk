const admin = require("firebase-admin");
const cron = require("node-cron");
const getCurrentProvince = require("./service.provinceclassifier");
const firestore  = require("./service.firestore");
const rethinkDB = require("./service.rethinkdb");

const getBroadcastChannel = (io) => {
  const broadcastChannel = io.of("/broadcast");
  
  broadcastChannel.use(
    function(socket,next){
      require("./service.middleware").socketJWTAuthentication(socket,next);
    }
  );

  broadcastChannel.on("connection", function (socket) {
      rethinkDB.saveSocketID(socket.id,socket.decoded["id"]);
      socket.emit("connected", { hello: "world" });
      socket.on("my other event", function (data) {
        console.log(data);
      });
      socket.on("periodic update",async (data) => {
        const currentProvince = await getCurrentProvince(data.lat,data.lng);
        let Ref = firestore.collection("provinces").doc(currentProvince);
        // eslint-disable-next-line no-unused-vars
        let arrUnion = Ref.update({
        users: admin.firestore.FieldValue.arrayUnion("bk3RNwTe3H0dgfgggk_HHwgIpoDKCIZvvDMExUdFQ3P1")
      });
      });

      socket.on("disconnect",function(){
        rethinkDB.removeSocket(socket.id);
      });

      socket.on("forward",function(data){
        rethinkDB.forwardIncident(data.report_id,data.forward_id,data.log);
      });

      socket.on("status",function(data){
        rethinkDB.updateStatus(data.report_id,data.status,data.log);

      });

      socket.on("log",function(data){
        rethinkDB.updateLog(data.report_id,data.log);
      });
      
    });
  
  return broadcastChannel;


};


const initiatePeriodicBroadcast = (io) => {
  const broadcastChannel = io.of("/broadcast");
  cron.schedule("* * * * *",function(){
    let FieldValue = require("firebase-admin").firestore.FieldValue;
    let cityRef = firestore.collection("provinces").doc("WP");
    // eslint-disable-next-line no-unused-vars
    let removeWP = cityRef.update({
      users: FieldValue.delete()
    });
    // TODO change the data send after finalizing communication with frontend / mobile app
    broadcastChannel.emit("update location",{data:{lat:"lat",lng:"lng",message:"msg"}});
    
    
  });

};



module.exports = {getBroadcastChannel,initiatePeriodicBroadcast};
