const alert = require("./service.model")

const saveAndSendAlert = async (req,res) => {
    const id = req.body.token.id
    const province_list = req.body.province_list
    const title = req.body.title
    const body = req.body.body
    const level = req.body.level
    if(id == "" || province_list == '' || title == '' ||body == ''||level == ''){
        err = 'fields cannot be empty'
        res.status(400).send({
            "status": 400,
            "message": "Bad request",
            'error': err
        })
    }
    else{
        try{
            const result = await alert.sendAlert(province_list,title,body,level)
            const msg_id = await alert.saveAlert(id,province_list,title,body,level,'','')
            if (result.length == 0){
                res.status(200).send({
                    "status":200,
                    "message":"No users",
                })
            }
            res.status(201).send({
                "status":201,
                "message":"Successfully sent",
                'users': result,
                'msg_id': msg_id
            })
                
        }catch(err){
            console.log('error',err);
            res.status(500).send({
                "status": 500,
                "message": "Internal server error",
                'error': err
            })
        }
    }
    
}

const saveAndSendAll = async (req,res) => {
    const id = req.body.token.id
    const title = req.body.title
    const body = req.body.body
    const level = req.body.level
    const center = req.body.center
    const radius = req.body.radius
    if(id == '' || title == '' ||body == ''||level == ''||center == ''||radius == ''){
        err = 'fields cannot be empty'
        res.status(400).send({
            "status":400,
            "message":"Bad request",
            'error': err
        })
    }
    else{
        try{
            const result = await alert.sendAlertAll(title,body,level,center,radius)
            const msg_id = await alert.saveAlert(id,'',title,body,level,center,radius)
            if (result.length == 0){
                res.status(200).send({
                    "status":200,
                    "message":"No users",
                })
            }
            else{
                res.status(201).send({
                    "status":201,
                    "message":"Successfully sent",
                    'users': result,
                    'msg_id': msg_id
                })
            }
            
        }catch(err){
            console.log('error',err);
            res.status(500).send({
                "status": 500,
                "message": "Internal server error",
                'error': err
            })
        }
    }
}

const getMessages = async (req,res) => {
    const id = req.body.token.id
    if(id == ''){
        err = 'fields cannot be empty'
        res.status(400).send({
            "status":400,
            "message":"Bad request",
            'error': err
        })
    }
    else{
        try{
            const result = await alert.getMessages(id)
            console.log(result.length)
            if (result.length == 0){
                res.status(200).send({
                    "status":200,
                    "message":"no messages",
                });
            }
            else{
                res.status(201).send({
                    "status":201,
                    "message":"Success",
                    'message_list':result
                });
            }
            
        }
        catch(err){
            res.status(500).send({
                "status": 500,
                "message": "Internal server error",
                'error': err
            })
        }
    }
    
}

const saveLocation = async (req,res) => {
    const prev_location = req.body.prev_location
    const curr_location = req.body.curr_location
    const FCM_token = req.body.FCM_token
    if(FCM_token == '' || prev_location == '' ||FCM_token == ''){
        err = 'fields cannot be empty'
        res.status(400).send({
            "status":400,
            "message":"Bad request",
            'error': err
        })
    }
    else{
        try{
            const result = await alert.saveLocation(prev_location, curr_location, FCM_token)
            res.status(201).send({
                "status":201,
                "message":"location saved"
            })
            //console.log(res)  
        }catch(err){
            console.log('error',err);
            res.status(500).send({
                "status":500,
                "message":"Internal server error",
                'error': err
            })
        }
    }
}



module.exports = {saveAndSendAlert,saveAndSendAll,saveLocation,getMessages}
