const r = require("rethinkdb");

const initiateRealTimeDB = async () => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
      r.dbList()
        .contains("commhawk")
        .do(function (databaseExists) {
            // if(databaseExists){
            //     watchChanges(conn);
            // }
          return r.branch(
            databaseExists,
            { dbs_created: 0 },
            r.dbCreate("commhawk")
          );
        })
        .run(conn,function(err,res){
            if (err) throw err;
            if(res.dbs_created == 1){
                r.db("commhawk").tableCreate("map_ids").run(conn,function(err,res){
                    if (err) throw err;
                    console.log(res);
                });
            }
        });
    });
       
};

const saveSocketID = async (socketId,instituteId) => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
        r.db("commhawk").table("map_ids").insert({
            "instituteId": instituteId,
            "socketId": socketId
        }).run(conn);
    });
};

const removeSocket = async (socketId) => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
        r.db("commhawk").table("map_ids").filter({"socketId":socketId}).delete().run(conn);
    });
};

const createIncidentDoc = async (instituteId,broadCastChannel) => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
        // eslint-disable-next-line no-unused-vars
        r.db("commhawk").tableCreate(instituteId).run(conn,async function(err,res){
            if (err) throw err;

            await r.db("commhawk").table(instituteId).insert({
                "institute_id": instituteId,
                "report_count": 0,
                "reports":[]
            }).run(conn);

            return r.db("commhawk").table(instituteId).changes().run(conn,function(err,cursor){
                cursor.each(function(err, row) {
                    if (err) throw err;
                    console.log("Chnage captured to Institute table " +instituteId);
                    // Get the related report and replace with row
                    dispatchIncident(instituteId,broadCastChannel,row,"Incident");
                });
            });
        });
    
    });    
};

const createReportDoc = async (institutes,user,report,broadCastChannel) => {
    let institute_ids = [];
    for await (const institute of institutes){
        institute_ids.push(institute.institute_id);
    }
    
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
        // eslint-disable-next-line no-unused-vars
        r.db("commhawk").tableCreate(report.id).run(conn,async function(err,res){
            if (err) throw err;
            // insert report and instittutes to auto assigned
            // set up listners
            await r.db("commhawk").table(report.id).insert({
                "report_id": report.id,
                "user_details":user,
                "auto_assigned":institutes,
                "ids":institute_ids,
                "subscribed":{
                    "forwarded":[],
                    "status":0,
                    "logs":[]
                },
                "report":report
                
            }).run(conn);

            institute_ids.forEach(id => {
                console.log("Inside auto assign");
                const date = new Date();
                const timestamp = date.getTime();
                r.db("commhawk").table(id).update({
                    "reports": r.row("reports").append({"id":report.id,"timestamp": r.epochTime(timestamp/1000.0)})
                }).run(conn);
            });

            return r.db("commhawk").table(report.id).getField("subscribed").changes().run(conn,function(err,cursor){
                console.log("Change captured in forward");
                const date = new Date();
                const timestamp = date.getTime();
                cursor.each(function(err, row) {
                    console.log(row);
                    //console.log(row.new_val[0])

                    if (err) throw err;
                    if(row.new_val.forwarded.length != row.old_val.forwarded.length){
                        let id = row.new_val.forwarded.filter(x => ! row.old_val.forwarded.includes(x));
                        // id[0] is taken because only 1 change can happen at a time.
                            console.log("Inside forward if");

                            r.db("commhawk").table(id[0]).update({
                                "reports": r.row("reports").append({"id":report.id,"timestamp": r.epochTime(timestamp/1000.0)})
                                
                            }).run(conn);
                            institute_ids.push(id[0]);

                            // disptach 

                    }else if (row.new_val.status != row.old_val.status){
                        institute_ids.forEach(id => {
                            console.log("Dispatching status");
                            dispatchIncident(id,broadCastChannel,{"report_id":report.id,"status":row.new_val.status},"Incident");
                        });
                    }else if(row.new_val.logs.length != row.old_val.logs.length){
                        let new_message = row.new_val.logs.filter(x => ! row.old_val.logs.includes(x));
                        console.log("Dispatching new message");
                        institute_ids.forEach(id => {
                            console.log("Dispatching messages");
                            dispatchIncident(id,broadCastChannel,new_message[0],"Incident");
                        });

                    }
                    
                  
                    
                });
            });

        });

    });
    
    
   

};


const dispatchIncident = async (instituteId,broadCastChannel,incident,emitterName) => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
    r.db("commhawk").table("map_ids").filter(r.row("instituteId").eq(instituteId)).
    run(conn, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log("Dispatching to :"+instituteId);
            if(result[0]){
                broadCastChannel.to(result[0].socketId).emit(emitterName,incident);
            }
           
        });
    });
    });
};


const watchChanges = async (broadCastChannel) => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
    r.db("commhawk").tableList().run(conn,function(err,cursor){
        cursor.each(function(err,row){
            if (err) throw err;
            r.db("commhawk").table(row).hasFields("institute_id").run(conn,function(err,cursor){
                cursor.toArray(function(err,result){
                    if(result[0]){
                        console.log(result[0].institute_id);
                        return r.db("commhawk").table(result[0].institute_id).changes().run(conn,function(err,cursor){
                            cursor.each(function(err, row) {
                                if (err) throw err;
                                console.log("Changed");
                                dispatchIncident(result[0].institute_id,broadCastChannel,row,"Incident");
                            });
                        });
                    }

                });

                r.db("commhawk").table(row).hasFields("report_id").run(conn,function(err,cursor){
                    cursor.toArray(function(err,result){
                        if(result[0]){
                            console.log(result[0].report_id);
                            const report_id = result[0].report_id;
                            return r.db("commhawk").table(report.id).getField("subscribed").changes().run(conn,function(err,cursor){
                                console.log("Change captured in forward");
                                const date = new Date();
                                const timestamp = date.getTime();
                                cursor.each(function(err, row) {
                                    console.log(row);
                                    //console.log(row.new_val[0])
                
                                    if (err) throw err;
                                    if(row.new_val.forwarded.length != row.old_val.forwarded.length){
                                        let id = row.new_val.forwarded.filter(x => ! row.old_val.forwarded.includes(x));
                
                                        // id[0] is taken because only 1 change can happen at a time.
                
                                            r.db("commhawk").table(id[0]).update({
                                                "reports": r.row("reports").append({"id":report.id,"timestamp": r.epochTime(timestamp/1000.0)})
                                                
                                            }).run(conn);
                                            institute_ids.push(id[0]);
                
                                            // disptach 
                
                                    }else if (row.new_val.status != row.old_val.status){
                                        institute_ids.forEach(id => {
                                            console.log("Dispatching status");
                                            dispatchIncident(id,broadCastChannel,{"report_id":report.id,"status":row.new_val.status},"Incident");
                                        });
                                    }else if(row.new_val.log.length != row.old_val.log.length){
                                        let new_message = row.new_val.log.filter(x => ! row.old_val.log.includes(x));
                                        console.log("Dispatching new message");
                                        institute_ids.forEach(id => {
                                            console.log("Dispatching messages");
                                            dispatchIncident(id,broadCastChannel,new_message[0],"Incident");
                                        });
                
                                    }
                                    
                                  
                                    //dispatchIncident(instituteId,broadCastChannel,row);
                                });
                            });

                        }
                    });

                });


            });
        });

    });
});

};


// const getAllIncidents = async (instituteId) => {
//     r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
//         r.db("commhawk").table(instituteId).filter(r.row("instituteId").eq(instituteId)).
//         run(conn, function(err, cursor) {
//             if (err) throw err;
//             cursor.toArray(function(err, result) {
//                 if (err) throw err;
//                 console.log(result[0].socketId);
//                 broadCastChannel.to(result[0].socketId).emit("Incident",incident);
//             });
//         });
//         });


// };

// const individualIncidentReport = async (incidentObj) => {



// };



module.exports = {initiateRealTimeDB,saveSocketID,removeSocket,createIncidentDoc,dispatchIncident,createReportDoc,watchChanges};

