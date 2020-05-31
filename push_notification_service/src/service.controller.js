const alert = require("./service.model")

const saveAndSendAlert = async (req,res) => {
    console.log("Here")
    const province = req.body.province
    const title = req.body.title
    const body = req.body.body
    const level = req.body.level
    if(province == '' || title == '' ||body == ''||level == ''){
        err = 'fields cannot be empty'
        res.status(400).send({
            "status": 400,
            "message":"Bad request",
            'error': err
        })
    }
    else{
        try{
            const result = await alert.sendAlert(province,title,body,level)
            const id = await alert.saveAlert(province,title,body,level)
            res.status(201).json({
                "status": 201,
                'users': result,
                'msg_id': id
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
    const province = req.body.province
    const title = req.body.title
    const body = req.body.body
    const level = req.body.level
    if(province == '' || title == '' ||body == ''||level == ''){
        err = 'fields cannot be empty'
        res.status(400).send({
            "status":400,
            "message":"Bad request",
            'error': err
        })
    }
    else{
        try{
            const result = await alert.sendAlertAll(province,title,body,level)
            const id = await alert.saveAlert(province,title,body,level)
            res.status(201).send({
                "status":201,
                "message":"Alert sent successfully",
                'users': result,
                'msg_id': id
            })
                
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

const saveLocation = async (req,res) => {
    //console.log(req.body)
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
                "message":"location saved",
                'users': result,
            })
                
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



module.exports = {saveAndSendAlert,saveAndSendAll,saveLocation}
