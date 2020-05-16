const db = require('./service.firestore')
const FCM = require('fcm-node');
const serverKey = 'AAAAuJRM-o0:APA91bGKORX2zFjwtOz6gY948-4EuzZJgSIUSpmP2LebX7HYWmKycXuF1iteQlZCEzddDHp5Gy4A8yMz0FGB-W0c6GdfLkjFF3bXzA83JqMdOQEn9JFpYkupje-RkdehxoABqOO3e9XY'; // put your server key here
const fcm = new FCM(serverKey);

const sendAlert = async(province,title,body,level) =>{
    const result = await db.collection('locations').doc(province).get()
        .then(doc => {
            if (doc.data() == undefined) {
                console.log('No matching documents.');
            } 
            else{
                user_tokens = doc.data().available_users
                send(user_tokens,province,title,body,level)
                return user_tokens
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
    })
    return result
}

const sendAlertAll = async(province,title,body,level) =>{
    var user_list = []
    const result = await db.collection("users").get()
    .then(snapshot => {
        if (snapshot.empty) {
            console.log('No matching documents.');
        } 
        snapshot.forEach(doc => {
            user_token = doc.id
            user_list.push(user_token)
        });
        send(user_list,province,title,body,level)
        return user_list
        })
    .catch(err => {
        console.log('Error getting documents', err);
    });   
    return result
}


const saveAlert = async(province,title,body,level) => {
    var today = new Date();
    const msgData = {
        province: province,
        title: title,
        body: body,
        level: level,
        created: today
    }
    const result = await db.collection('messages').add(msgData).then(doc =>{
        return(doc.id)
    })
    return result
}

function send(list,province,title,body,level){
    var today = new Date();
    var m = today.getMonth();
    var d = today.getDate();
    var h = today.getHours();
    var min = today.getMinutes();

    m += 1;
    if (m<=9){m = '0'+m}
    if (d<=9){d = '0'+d}
    if (min<=9){min = '0'+min}
    if (h<=9){h = '0'+h}
    
    var date = today.getFullYear()+'-'+m+'-'+d;
    var time = h + ":" + min
    title = title + ' in ' + province
  
    if (list == []){
        console.log('no users')
    }
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

module.exports = {sendAlert,saveAlert,sendAlertAll};