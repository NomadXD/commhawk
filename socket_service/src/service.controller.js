const rethinkDB = require("./service.rethinkdb");
const fetch = require("node-fetch");
const uuid = require("uuid/v4");
const jwt = require("jsonwebtoken");
const upload = require("./service.fileupload");
const singleUpload = upload.single("image");
const reportModel = require("./service.model");


const dispatchBroadcast = async (req,res) => {

    req.broadcastChannel.emit("emergency",{data:{lat:"lat",lng:"lng",message:"msg"}});
    res.json({
        "success":200
    });

};

// eslint-disable-next-line no-unused-vars
const messengeSenderController = async (req,res) => {
    let decoded;
    if(req.headers["authorization"]){
        const token = req.headers["authorization"].split(" ")[1];
        if(!token) res.status(401).json("Unauthorize user");
        try{
            decoded = jwt.verify(token,"secret");
        }catch(e){
            res.status(400).json("Token not valid");
        }

    }else{
        res.status(400).json("No token found");
    }
    

    let report = {};

    singleUpload(req,res,async (err)=> {
        if (err){
          throw err;
        }
        
        if (req.file){
            report["url"] = req.file.location;
        }
        console.log(req.body.title);
        report["id"] = uuid();
        report["title"] = req.body.title;
        report["description"] = req.body.description;
        report["location"] = JSON.parse(req.body.data).location;
        report["categories"] = JSON.parse(req.body.data).categories;
        
        const govDataPromise = fetch("http://gov_auth:3000/api/gov/get-related-institutes",{
                                        method: "post",
                                        body:   req.body.data,
                                        headers: { "Content-Type": "application/json" },
                                });
                                
        const userDataPromise = fetch(`http://uds:3000/api/user/${decoded.id}`);
        const promises = [govDataPromise,userDataPromise];
        const [govDataResponse,userDataResponse] = await Promise.all(promises);
        const govDataJSON = await govDataResponse.json();
        const userDataJSON = await userDataResponse.json();
    
        if(userDataJSON.userdata){
            await rethinkDB.createReportDoc(govDataJSON.institutes,userDataJSON.userdata,report,req.broadcastChannel);
            let institutes = govDataJSON.institutes;
            res.status(200).send({
                "status":200,
                "message":"Success",
                "institutes":institutes,
                "report_id":report["id"]
            });

            const headers = {
                "Content-Type":"application/json"
            };

            //
            const modelResponse = await fetch("https://lochana.pythonanywhere.com/predictTokens", {method: "POST", body: JSON.stringify({"message":report.description}) ,headers:headers}).then(res => res.json());
            reportModel.saveReportData(report, modelResponse.tokens);
            //
    
        }else{
            res.status(500).send({
                "status":500,
                "message": "User account not found"
            });
        }
        
      
      });

      
   
    

    

    // if(req.body.location || req.body.categories){
    //     res.status(406).send({
    //         "status":406,
    //         "message":"Not acceptable. Location or categories missing"
    //     });
    // }

    //return none;

    // const govDataPromise = fetch("http://gov_auth:3000/api/gov/get-related-institutes",{
    //                                     method: "post",
    //                                     body:    JSON.stringify(data),
    //                                     headers: { "Content-Type": "application/json" },
    //                             }); 

   
    // const userDataPromise = fetch(`http://uds:3000/api/user/${decoded.id}`);
    // const promises = [govDataPromise,userDataPromise];
    // const [govDataResponse,userDataResponse] = await Promise.all(promises);
    // const govDataJSON = await govDataResponse.json();
    // const userDataJSON = await userDataResponse.json();

    // if(userDataJSON.userdata){

        

    //     await rethinkDB.createReportDoc(govDataJSON.institutes,userDataJSON.userdata,{"id":uuid()},req.broadcastChannel);
    //     let institutes = govDataJSON.institutes;
    //     res.status(200).send({
    //         "status":200,
    //         "message":"Success",
    //         "institutes":institutes
    //     });

    // }else{
    //     res.status(500).send({
    //         "status":500,
    //         "message": "User account not found"
    //     });
    // }

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

const testImageUpload = async (req,res) => {

    
    let report ={};
    let data = {};
    singleUpload(req,res,(err)=>{
        if (err){
          throw err;
        }
        
        if (req.file){
            report["url"] = req.file.location;
        }

        //return req.file.location;

        report["id"] = uuid();
        report["title"] = req.body.title;
        report["description"] = req.body.description;
        report["location"] = req.body.location;
        data["location"] = req.body.location;
        data["categories"] = req.body.categories;
      
      });
    

      res.json({
          "Test":"test"
      });

};


module.exports = {dispatchBroadcast, messengeSenderController, createTableController, watchChangesController , getIncidentController, testImageUpload};