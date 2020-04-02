const pool = require('./service.config')
const jwt = require('jsonwebtoken')

const signUpUserController = async (req,res) => {

    const token = jwt.sign({"user":{"name":"Lahiru","id":1234}},"secret")

   res.json({
       "success":200,
       "token":token,
       "body":req.body
       
   })


}

const signInUserController = async (req,res) => {

    res.json({
        "success":200
    })


}


const updateUserController = async (req,res) => {

    console.log(req.body)

    res.json({
        "success":2000, 
        "data":req.body.user
    })

}

const deleteUserController = async (req,res) => {

    res.json({
        "success":200,
        "user":req.user,
        "data":req.body
    })

}


const getUserController = async (req,res) => {

    res.json({
        "success":200,
        "user":req.user,
        "data":req.body
    })

}




module.exports = {signUpUserController,signInUserController,updateUserController,deleteUserController,getUserController};