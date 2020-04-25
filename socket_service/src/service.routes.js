/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const socketController = require("./service.controller");
// const firestore  = require("./service.firestore");
// const admin = require("firebase-admin");
// const rethinkDB = require("./service.rethinkdb");


router.get("/test",async (req,res)=> {
    // let Ref = firestore.collection("provinces").doc("WP");
    // let arrUnion = Ref.update({
    //     users: admin.firestore.FieldValue.arrayUnion("bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1")
    //   });

    // await rethinkDB.createIncidentDoc("13f77fe4-abee-4e00-8c5b-e2f0ab01e29b",req.broadcastChannel);
    //await rethinkDB.insertIncident();
  
    res.json({
        "sucess": "From socket service",
        "result":"Hi gov!"
    });
});

router.post("/send-message",socketController.messengeSenderController);

router.get("/create-document/:id",socketController.createTableController);

// TODO change to POST after finalizing
router.get("/broadcast",socketController.dispatchBroadcast);


router.get("/watch",socketController.watchChangesController);

router.get("/get-incidents/:id",socketController.getIncidentController);


module.exports = router;