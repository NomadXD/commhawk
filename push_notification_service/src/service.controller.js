const alert = require("./service.model")

const saveAndSendAlert = async (req,res) => {
    const province = req.body.province
    const title = req.body.title
    const body = req.body.body
    const level = req.body.level
    try{
        const result = await alert.sendAlert(province,title,body,level)
        const id = await alert.saveAlert(province,title,body,level)
        res.json({
            'users': result,
            'msg_id': id
        })
            
    }catch(err){
        console.log('error',err);
    }
}

const saveAndSendAll = async (req,res) => {
    const province = req.body.province
    const title = req.body.title
    const body = req.body.body
    const level = req.body.level
    try{
        const result = await alert.sendAlertAll(province,title,body,level)
        const id = await alert.saveAlert(province,title,body,level)
        res.json({
            'users': result,
            'msg_id': id
        })
            
    }catch(err){
        console.log('error',err);
    }
}

module.exports = {saveAndSendAlert,saveAndSendAll}
