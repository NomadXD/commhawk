const express = require("express");
const router = express.Router();
const socketController = require("./service.controller");
const firestore  = require("./service.firestore");
const admin = require("firebase-admin");


router.get("/test",(req,res)=> {
    let Ref = firestore.collection("provinces").doc("WP");
    let arrUnion = Ref.update({
        users: admin.firestore.FieldValue.arrayUnion("bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1")
      });
    res.json({
        "sucess": "From socket service",
        "result":arrUnion
    });
});

// TODO change to POST after finalizing
router.get("/broadcast",socketController.dispatchBroadcast);


module.exports = router;