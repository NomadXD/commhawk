const alert = require("./service.model")

const saveAndSendAlert = async (req,res) => {
    const province = req.body.province
    const title = req.body.title
    const body = req.body.body
    const level = req.body.level
    if(province == '' || title == '' ||body == ''||level == ''){
        err = 'fields cannot be empty'
        res.json({
            'error': err
        })
    }
    else{
        try{
            const result = await alert.sendAlert(province,title,body,level)
            const id = await alert.saveAlert(province,title,body,level)
            res.json({
                'users': result,
                'msg_id': id
            })
                
        }catch(err){
            console.log('error',err);
            res.json({
                'error': err
            })
        }
    }
    
}

const saveAndSendAll = async (req,res) => {
    const province = req.body.province
    const title = req.body.title
    const body = req.body.body
    const level = req.body.level
    if(province == '' || title == '' ||body == ''||level == ''){
        err = 'fields cannot be empty'
        res.json({
            'error': err
        })
    }
    else{
        try{
            const result = await alert.sendAlertAll(province,title,body,level)
            const id = await alert.saveAlert(province,title,body,level)
            res.json({
                'users': result,
                'msg_id': id
            })
                
        }catch(err){
            console.log('error',err);
            res.json({
                'error': err
            })
        }
    }
}

const saveLocation = async (req,res) => {
    //console.log(req.body)
    const prev_location = req.body.prev_location
    const curr_location = req.body.curr_location
    const FCM_token = req.body.FCM_token
    if(FCM_token == '' || prev_location == '' ||FCM_token == ''){
        err = 'fields cannot be empty'
        res.json({
            'error': err
        })
    }
    else{
        try{
            const result = await alert.saveLocation(prev_location, curr_location, FCM_token)
            res.json({
                'users': result,
            })
                
        }catch(err){
            console.log('error',err);
            res.json({
                'error': err
            })
        }
    }
}



module.exports = {saveAndSendAlert,saveAndSendAll,saveLocation}
