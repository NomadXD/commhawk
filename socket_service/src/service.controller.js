const dispatchBroadcast = async (req,res) => {

    req.socket.emit('emergency',{data:{lat:req.body.lat,lng:req.body.lng,message:req.body.message}})
    res.json({
        "success":200
    })

}


module.exports = {dispatchBroadcast}