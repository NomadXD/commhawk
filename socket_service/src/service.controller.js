const rethinkDB = require("./service.rethinkdb");

const dispatchBroadcast = async (req,res) => {

    req.broadcastChannel.emit("emergency",{data:{lat:"lat",lng:"lng",message:"msg"}});
    res.json({
        "success":200
    });

};

const messengeSenderController = async (req,res) => {

    // TODO send to NLP service

    // TODO send to Gov auth service

    // TODO send to user data service




};


const createTableController = async (req,res) => {

    const broadcastChannel = req.broadcastChannel;
    const institute_id = req.params.id;

    try{
        rethinkDB.createIncidentDoc(institute_id,broadcastChannel);
    }catch(err){
        res.json({
            "result" : "Document craetion failed"
        });
    }

    res.json({
        "result": "Document successfully created"
    });

};


module.exports = {dispatchBroadcast, messengeSenderController, createTableController};