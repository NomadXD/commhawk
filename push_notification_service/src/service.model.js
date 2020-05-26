const db = require('./service.firestore');
const FCM = require('fcm-node');
const serverKey = 'AAAAuJRM-o0:APA91bGKORX2zFjwtOz6gY948-4EuzZJgSIUSpmP2LebX7HYWmKycXuF1iteQlZCEzddDHp5Gy4A8yMz0FGB-W0c6GdfLkjFF3bXzA83JqMdOQEn9JFpYkupje-RkdehxoABqOO3e9XY'; // put your server key here
const fcm = new FCM(serverKey);
const getCurrentProvince = require('./service.province-classifier');

const sendAlert = async(province,title,body,level) =>{
    const result = await db.collection('locations').doc(province).get()
        .then(doc => {
            if (doc.data() == undefined) {
                console.log('No matching documents.');
                s = 'No matching docs'
                return s
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
            s = 'No matching docs'
            return s
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

const saveLocation = async(prev_location, curr_location, FCM_token) => {
    var prev_province = null;

    if(prev_location != null){
        prev_lng = prev_location[1]
        prev_lat = prev_location[0]
        var prev_province = await getCurrentProvince(prev_lat,prev_lng)
        console.log(prev_province,prev_lat,prev_lng);
    }
    curr_lng = curr_location[1]
    curr_lat = curr_location[0]
    console.log(curr_lat,curr_lng)
    var curr_province = await getCurrentProvince(curr_lat,curr_lng)

    console.log(curr_province)
    if (prev_province != null){
        if(prev_province != curr_province){
            let ref_prev_province = db.collection('locations').doc(prev_province);
            let ref_curr_province = db.collection('locations').doc(curr_province);
            let transaction1 = db.runTransaction( async t_prev => {
                const result = await t_prev.get(ref_prev_province)
                    .then(doc => {
                        if (doc.data() == undefined) {
                            console.log('No matching documents.');
                            s = 'No matching docs'
                            console.log(s)
                            return s
                        } 
                        else{
                            user_tokens = doc.data().available_users
                            const index = user_tokens.indexOf(FCM_token);
                            if (index > -1) {
                                user_tokens.splice(index, 1);
                            }
                            t_prev.update(ref_prev_province, {available_users: user_tokens});
                            return db.runTransaction( async t_curr => {
                                const result =  await t_curr.get(ref_curr_province)
                                    .then(doc => {
                                        if (doc.data() == undefined) {
                                            user_tokens = [FCM_token]
                                            t_curr.set(ref_curr_province, {available_users: user_tokens});
                                            return Promise.resolve(user_tokens)
                                        } 
                                        else{
                                            user_tokens = doc.data().available_users
                                            user_tokens.push(FCM_token)
                                            t_curr.update(ref_curr_province, {available_users: user_tokens});
                                            return Promise.resolve(user_tokens)
                                        }
                                    })
                                    .catch(err => {
                                        console.log('Error getting documents', err);
                                })
                                return result
                            })
                        }
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                })
                console.log(result)
                return result
            })
            return transaction1
        }else{
            s = 'location not changed'
            //console.log('location not changed')
            return s
        }
    }
    else{
        const result = await db.collection('locations').doc(curr_province).get()
        .then(doc => {
            if (doc.data() == undefined) {
                user_tokens = [FCM_token]
                db.collection('locations').doc(curr_province).set({available_users: user_tokens});
                return Promise.resolve(user_tokens)
            } 
            else{
                user_tokens = doc.data().available_users
                user_tokens.push(FCM_token)
                db.collection('locations').doc(curr_province).update({available_users: user_tokens})
                return Promise.resolve(user_tokens)
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        })
        return result
    }

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

module.exports = {sendAlert,saveAlert,sendAlertAll,saveLocation};