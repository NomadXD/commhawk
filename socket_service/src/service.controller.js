const rethinkDB = require("./service.rethinkdb");
const uuid = require("uuid/v4");
const fetch = require("node-fetch");


const dispatchBroadcast = async (req,res) => {

    req.broadcastChannel.emit("emergency",{data:{lat:"lat",lng:"lng",message:"msg"}});
    res.json({
        "success":200
    });

};

// eslint-disable-next-line no-unused-vars
const messengeSenderController = async (req,res) => {

    // TODO send to NLP service

    // TODO send to Gov auth service

    // TODO send to user data service
    const userDataResponse = await fetch(`http://uds:3000/api/user/${req.body.token.id}`).then(res => res.json());

    console.log(userDataResponse);

    res.json({
        "message":"Success",
        "data": userDataResponse
    });





};


const createTableController = async (req,res) => {

    const broadcastChannel = req.broadcastChannel;
    const institute_id = req.params.id;

    try{
        rethinkDB.createIncidentDoc(institute_id,broadcastChannel);
    }catch(err){
        res.json({
            "status":500,
            "result" : "Document craetion failed"
        });
    }

    res.json({
        "status": 201,
        "result": "Document successfully created"
    });

};


module.exports = {dispatchBroadcast, messengeSenderController, createTableController};