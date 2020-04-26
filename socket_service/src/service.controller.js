const rethinkDB = require("./service.rethinkdb");
const fetch = require("node-fetch");
const uuid = require("uuid/v4");


const dispatchBroadcast = async (req,res) => {

    req.broadcastChannel.emit("emergency",{data:{lat:"lat",lng:"lng",message:"msg"}});
    res.json({
        "success":200
    });

};

// eslint-disable-next-line no-unused-vars
const messengeSenderController = async (req,res) => {

    const body = req.body;

    // if(req.body.location || req.body.categories){
    //     res.status(406).send({
    //         "status":406,
    //         "message":"Not acceptable. Location or categories missing"
    //     });
    // }

    const govDataPromise = fetch("http://gov_auth:3000/api/gov/get-related-institutes",{
                                        method: "post",
                                        body:    JSON.stringify(body),
                                        headers: { "Content-Type": "application/json" },
                                }); 

   
    const userDataPromise = fetch(`http://uds:3000/api/user/${req.body.token.id}`);

    const promises = [govDataPromise,userDataPromise];
    const [govDataResponse,userDataResponse] = await Promise.all(promises);
    const govDataJSON = await govDataResponse.json();
    const userDataJSON = await userDataResponse.json();

    if(userDataJSON.userdata){
        await rethinkDB.createReportDoc(govDataJSON.institutes,userDataJSON.userdata,{"id":uuid()},req.broadcastChannel);
        let institutes = govDataJSON.institutes;
        res.status(200).send({
            "status":200,
            "message":"Success",
            "institutes":institutes
        });

    }else{
        res.status(500).send({
            "status":500,
            "message": "User account not found"
        });
    }

};


const createTableController = async (req,res) => {

    const broadcastChannel = req.broadcastChannel;
    const institute_id = req.params.id;

    try{
        rethinkDB.createIncidentDoc(institute_id,broadcastChannel);
    }catch(err){
        res.json({
            "status":500,
            "result" : "Document creation failed!"
        });
    }

    res.json({
        "status": 201,
        "result": "Document successfully created"
    });

};


const watchChangesController = async (req,res) => {
    try{
        await rethinkDB.watchChanges(req.broadcastChannel);
        res.status(200).send({
            "message":"Attached listners"
        });
    }catch(err){
        res.status(500).send({
            "status":500,
            "message":"Internal server error",
            "error":err
        });

    }
    
   
};

const getIncidentController = async (req,res) => {
    const instituteId = req.params.id;
    rethinkDB.getIncidents(instituteId,res);
   
};


module.exports = {dispatchBroadcast, messengeSenderController, createTableController, watchChangesController , getIncidentController};