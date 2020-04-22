const db = require('./alert.firestore')
const FCM = require('fcm-node');
const serverKey = 'AAAAuJRM-o0:APA91bGz0E1Xg_KX6nDtorpVst7tsl3wcfSBKqa89tl70Y7tn6twMCQ2LhYm9BcfDSNmWRyIl41gHK2HFrx1Udy_dhpzrwpwo6yXCHfpJC46BiiB7JK3CcILGtacTMmy2MUFNm6Gt7n7'; // put your server key here
const fcm = new FCM(serverKey);

const sendAlert = async(district,title,body,level) =>{
        const result = await db.collection('locations').doc(district).get()
            .then(doc => {
                user_tokens = doc.data().available_users
                send(user_tokens)
                return user_tokens
            })
            .catch(err => {
                console.log('Error getting documents', err);
        })
            
        function send(list){
            var today = new Date();
            var m = today.getMonth();
            var d = today.getDate();
            var h = today.getHours();
            var min = today.getMinutes();
            
            m += 1;
            if (m<9){m = '0'+m}
            if (d<9){d = '0'+d}
            if (min<9){min = '0'+min}
            if (h<9){h = '0'+h}
            
            var date = today.getFullYear()+'-'+m+'-'+d;
            var time = h + ":" + min
            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                registration_ids: list,
                collapse_key: '4',
                            
                notification: {
                    title: title, 
                    body: body,
                },
                            
                data: {  //you can send only notification or only data(or include both)
                    click_action: "FLUTTER_NOTIFICATION_CLICK",
                    title: title, 
                    body: body,
                    level: level,
                    date_time: date +'      '+ time
                    }
            };
                            
            fcm.send(message, function(err, response){
                if (err) {
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
    return result
}

const saveAlert = async(district,title,body,level) => {
    var today = new Date();
    const msgData = {
        district: district,
        title: title,
        body: body,
        level: level,
        created: today
    }
    const result = await db.collection('messages').add(msgData).then(doc =>{
        console.log(doc._path.segments[1])
        return(doc._path.segments[1])
    })
    return result
}

module.exports = {sendAlert,saveAlert};




