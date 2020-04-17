const r = require("rethinkdb");

const initiateRealTimeDB = async () => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
      r.dbList()
        .contains("commhawk")
        .do(function (databaseExists) {
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
        r.db("commhawk").tableCreate(instituteId).run(conn,function(err,res){
            if (err) throw err;
            return r.db("commhawk").table(instituteId).changes().run(conn,function(err,cursor){
                cursor.each(function(err, row) {
                    if (err) throw err;
                    dispatchIncident(instituteId,broadCastChannel,row);
                });
            });
        });
    
    });    
};


const dispatchIncident = async (instituteId,broadCastChannel,incident) => {
    r.connect({ host: "rethinkdb", port: 28015 }, function (err, conn) {
    r.db("commhawk").table("map_ids").filter(r.row("instituteId").eq(instituteId)).
    run(conn, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(result[0].socketId);
            broadCastChannel.to(result[0].socketId).emit("Incident",incident);
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



module.exports = {initiateRealTimeDB,saveSocketID,removeSocket,createIncidentDoc,dispatchIncident};

