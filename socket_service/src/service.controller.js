const rethinkDB = require("./service.rethinkdb");
//const uuid = require("uuid/v4");
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

    // create report document


    rethinkDB.createReportDoc(govDataJSON.institutes,userDataJSON.userdata,{"id":uuid()},req.broadcastChannel);
  

    

    res.json({
        "message":"Success",
        "data": userDataJSON,
        "gov": govDataJSON
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
            "result" : "Document craetion failed!"
        });
    }

    res.json({
        "status": 201,
        "result": "Document successfully created"
    });

};


const watchChangesController = async (req,res) => {
    rethinkDB.watchChanges(req.broadcastChannel);
    res.json({
        "true":"True"
    });
};


module.exports = {dispatchBroadcast, messengeSenderController, createTableController, watchChangesController};