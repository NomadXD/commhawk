const alert = require("./alert.model")

const saveAndSendAlert = async (req,res) => {
    const district = req.body.district
    const title = req.body.title
    const body = req.body.body
    const level = req.body.level
    try{
        const result = await alert.sendAlert(district,title,body,level)
        const id = await alert.saveAlert(district,title,body,level)
        res.json({
            'users': result,
            'msg_id': id
        })
            
    }catch(err){
        console.log('error',err);
    }
}

module.exports = {saveAndSendAlert}




