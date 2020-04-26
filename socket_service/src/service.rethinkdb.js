/* eslint-disable no-unused-vars */
const r = require("rethinkdb");

const initiateRealTimeDB = async (broadCastChannel) => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
      r.dbList()
        .contains("commhawk")
        .do(function (databaseExists) {
           // TODO attach listeners automatically upon server reloading
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

                // r.db("commhawk").tableCreate("b13b39b0-ef43-4df8-932f-6a1a79e1109d").run(conn);
                // r.db("commhawk").tableCreate("ade39ee6-ed99-4002-a655-35308d460f97").run(conn);
                // r.db("commhawk").tableCreate("2db8c542-18c8-465a-8d74-46e8338f4e43").run(conn);
                // r.db("commhawk").tableCreate("f274bdd4-8213-4b23-8fcb-994af0cd094d").run(conn);
                // r.db("commhawk").tableCreate("b17db592-6c65-4ec7-b5bc-e1b2483eeacf").run(conn);

                createIncidentDoc("b13b39b0-ef43-4df8-932f-6a1a79e1109d",broadCastChannel);
                createIncidentDoc("ade39ee6-ed99-4002-a655-35308d460f97",broadCastChannel);
                createIncidentDoc("2db8c542-18c8-465a-8d74-46e8338f4e43",broadCastChannel);
                createIncidentDoc("f274bdd4-8213-4b23-8fcb-994af0cd094d",broadCastChannel);
                createIncidentDoc("b17db592-6c65-4ec7-b5bc-e1b2483eeacf",broadCastChannel);
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

            return r.db("commhawk").table(instituteId).getField("reports").changes().run(conn,function(err,cursor){
                cursor.each(function(err, row) {
                    if (err) throw err;
                    console.log(row);
                    console.log("Chnage captured to Institute table " +instituteId);
                    let reportId = row.new_val.filter(x => ! row.old_val.includes(x));
                    r.db("commhawk").table(reportId[0].id).run(conn,function(err,cursor){
                        if (err) throw err;
                        cursor.toArray(function(err,result){
                            console.log(result);
                            dispatchIncident(instituteId,broadCastChannel,result[0],"Incident");
                        });
                    });
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
                    if (err) throw err;
                    if(row.new_val.forwarded.length != row.old_val.forwarded.length){
                        let id = row.new_val.forwarded.filter(x => ! row.old_val.forwarded.includes(x));
                        // id[0] is taken because only 1 change can happen at a time.
                            console.log("Inside forward if");

                            r.db("commhawk").table(id[0]).update({
                                "reports": r.row("reports").append({"id":report.id,"timestamp": r.epochTime(timestamp/1000.0)})
                                
                            }).run(conn);
                            institute_ids.push(id[0]);
                            console.log(institute_ids);

                

                    }else if (row.new_val.status != row.old_val.status){
                        r.db("commhawk").table(report.id).pluck("ids").run(conn,function(err,cursor){
                            cursor.toArray(function(err,result){
                                console.log(result[0]);
                                 result[0].ids.forEach(id => {
                                     console.log("Dispatching status to: "+id);
                                     dispatchIncident(id,broadCastChannel,{"report_id":report.id,"status":row.new_val.status},"Status");
                                 });
                               

                            });

                         });
                    }else if(row.new_val.logs.length != row.old_val.logs.length){
                        let new_message = row.new_val.logs.filter(x => ! row.old_val.logs.includes(x));
                        r.db("commhawk").table(report.id).pluck("ids").run(conn,function(err,cursor){
                            cursor.toArray(function(err,result){
                                console.log(result[0]);
                                 result[0].ids.forEach(id => {
                                     console.log("Dispatching logs to: "+report.id);
                                     dispatchIncident(id,broadCastChannel,{"report_id":report.id,"logs":new_message},"Log");
                                 });
                               
                            });

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
    r.connect({ host: "rethinkdb", port: 28015 },async function (err, conn) {
    r.db("commhawk").tableList().run(conn, async function(err,cursor){
        cursor.each(async function(err,row){
            if (err) throw err;
            r.db("commhawk").table(row).hasFields("institute_id").run(conn,async function(err,cursor){
                cursor.toArray(function(err,result){
                    if(result[0]){
                        console.log("Institute: " +result[0].institute_id);
                        let instituteId = result[0].institute_id;
                        return r.db("commhawk").table(result[0].institute_id).getField("reports").changes().run(conn,function(err,cursor){
                            cursor.each(function(err, row) {
                                if (err) throw err; 
                                console.log(row.new_val);
                                let reportId = row.new_val.filter(x => ! row.old_val.includes(x));
                                r.db("commhawk").table(reportId[0].id).run(conn,function(err,cursor){
                                    if (err) throw err;
                                    cursor.toArray(function(err,result){
                                        console.log(result);
                                        dispatchIncident(instituteId,broadCastChannel,result[0],"Incident");
                                    });
                                });
                            });
                        });
                    }

                });

                r.db("commhawk").table(row).hasFields("report_id").run(conn,async function(err,cursor){
                    cursor.toArray(async function(err,result){
                        if(result[0]){
                            console.log("Report: "+result[0].report_id);
                            let institute_ids = [];
                            await r.db("commhawk").table(result[0].report_id).pluck("ids").run(conn,async function(err,cursor){
                               cursor.toArray(function(err,result){
                                   console.log(result[0]);
                                    result[0].ids.forEach(id => {
                                        institute_ids.push(id);
                                    });
                                  

                               });

                            });
                            
                            return r.db("commhawk").table(result[0].report_id).getField("subscribed").changes().run(conn,function(err,cursor){
                                const date = new Date();
                                const timestamp = date.getTime();
                                cursor.each(function(err, row) {
                                    if (err) throw err;
                                    console.log(row.new_val);
                                    if(row.new_val.forwarded.length != row.old_val.forwarded.length){
                                        let id = row.new_val.forwarded.filter(x => ! row.old_val.forwarded.includes(x));
                
                                        // id[0] is taken because only 1 change can happen at a time.
                
                                            r.db("commhawk").table(id[0]).update({
                                                "reports": r.row("reports").append({"id":result[0].report_id,"timestamp": r.epochTime(timestamp/1000.0)})
                                                
                                            }).run(conn);
                                            institute_ids.push(id[0]);

                                    }else if (row.new_val.status != row.old_val.status){
                                        r.db("commhawk").table(result[0].report_id).pluck("ids").run(conn,function(err,cursor){
                                            let reportId = result[0].report_id;
                                            cursor.toArray(function(err,result){
                                                console.log(result[0]);
                                                 result[0].ids.forEach(id => {
                                                     console.log("Dispatching status to: "+id);
                                                     dispatchIncident(id,broadCastChannel,{"report_id":reportId,"status":row.new_val.status},"Status");
                                                 });
                                               
                
                                            });
                
                                         });

                                    }else if(row.new_val.logs.length != row.old_val.logs.length){
                                        let new_message = row.new_val.logs.filter(x => ! row.old_val.logs.includes(x));
                                        console.log("Dispatching new message");
                                        r.db("commhawk").table(result[0].report_id).pluck("ids").run(conn,function(err,cursor){
                                            let reportId = result[0].report_id;
                                            cursor.toArray(function(err,result){
                                                console.log(result[0]);
                                                 result[0].ids.forEach(id => {
                                                     console.log("Dispatching logs to: "+id);
                                                     dispatchIncident(id,broadCastChannel,{"report_id":reportId,"logs":new_message},"Log");
                                                 });
                                            });
                
                                         });
                
                                    }
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


const forwardIncident = async (reportId,forwardId,log) => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
        r.db("commhawk").table(reportId).update({
            "subscribed" : {"forwarded":r.row("subscribed")("forwarded").append(forwardId)}
        }).run(conn,function(err,res){
            if (err) throw err;
            r.db("commhawk").table(reportId).update({
                "ids": r.row("ids").append(forwardId)
            }).run(conn,function(err,res){
                if (err) throw err;
                r.db("commhawk").table(reportId).update({
                    "subscribed":{"logs":r.row("subscribed")("logs").append(log)}
                }).run(conn);
            });
        });
    });    

};


const updateStatus = async (reportId,status,log) => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
        r.db("commhawk").table(reportId).update({
            "subscribed": {"status":status}
        }).run(conn,function(err,res){
            if (err) throw err;
            r.db("commhawk").table(reportId).update({
                "subscribed":{"logs":r.row("subscribed")("logs").append(log)}
            }).run(conn);

        });


    });    
};


const updateLog = async (reportId,log) => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
        r.db("commhawk").table(reportId).update({
            "subscribed":{"logs":r.row("subscribed")("logs").append(log)}
        }).run(conn);

    });    
};


const getIncidents = async (instituteId,res) => {
    let reports = [];
    r.connect({ host: "rethinkdb", port: 28015 }, async function (err, conn) {
            r.db("commhawk").table(instituteId).getField("reports").run(conn,async function(err,cursor){
                if (err) throw err;
                cursor.each(async function(err,result){
                    if (err) throw err;
                    for await (let report of result){
                        console.log(report.id);
                        await r.db("commhawk").table(report.id).run(conn,async function(err,cursor){
                            if (err) return err;
                            cursor.each(function(err,result){
                                if (err) return err;
                                reports.push(result);
                            });
                        });
                    }
                    console.log(reports);
                    res.status(200).send({
                        "status":200,
                        "reports": reports 
                    });
                    
    
                });
                
            });
           
        
        
    });
};


module.exports = {initiateRealTimeDB,saveSocketID,removeSocket,createIncidentDoc,dispatchIncident,createReportDoc,watchChanges ,forwardIncident,updateStatus,updateLog, getIncidents};

