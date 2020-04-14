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

module.exports = {initiateRealTimeDB};

