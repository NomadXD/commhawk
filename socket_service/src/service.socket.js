const admin = require('firebase-admin');
const cron = require("node-cron")
const getCurrentProvince = require('./service.provinceclassifier')
const firestore  = require('./service.firestore')

const getBroadcastChannel = (io) => {
  const broadcastChannel = io.of('/broadcast');    

  broadcastChannel.on('connection', function (socket) {
      socket.emit('connected', { hello: 'world' });
      socket.on('my other event', function (data) {
        console.log(data);
      });
      socket.on('periodic update',async (data) => {
        const currentProvince = await getCurrentProvince(data.lat,data.lng)
        let Ref = firestore.collection('provinces').doc(currentProvince);
        let arrUnion = Ref.update({
        users: admin.firestore.FieldValue.arrayUnion('bk3RNwTe3H0dgfgggk_HHwgIpoDKCIZvvDMExUdFQ3P1')
      });
      })
      
    });
  
  return broadcastChannel


}


const initiatePeriodicBroadcast = (io) => {
  const broadcastChannel = io.of('/broadcast');
  cron.schedule("* * * * *",function(){
    let FieldValue = require('firebase-admin').firestore.FieldValue;
    let cityRef = firestore.collection('provinces').doc('WP');
    let removeWP = cityRef.update({
      users: FieldValue.delete()
    });
    // TODO change the data send after finalizing communication with frontend / mobile app
    broadcastChannel.emit('update location',{data:{lat:'lat',lng:'lng',message:'msg'}})
    
    
  })

}



module.exports = {getBroadcastChannel,initiatePeriodicBroadcast}
