const express = require("express");
const router = express.Router();
const socketController = require("./service.controller");


router.get('/test',(req,res)=> {
    res.json({
        "sucess": "From socket service"
    })
})

router.post('/broadcast',socketController.dispatchBroadcast)


module.exports = router;