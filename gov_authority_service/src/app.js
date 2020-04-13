const express = require("express");
const app = express();

app.get('/',(req,res)=>{
    console.log("Test!!")
})

module.exports = app;