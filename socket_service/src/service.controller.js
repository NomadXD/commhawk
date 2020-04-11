
const dispatchBroadcast = async (req,res) => {

    req.broadcastChannel.emit('emergency',{data:{lat:'lat',lng:'lng',message:'msg'}})
    res.json({
        "success":200
    })

}


module.exports = {dispatchBroadcast}