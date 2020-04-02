const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid/v4");
const userModel = require("./service.model");

const signUpUserController = async (req,res) => {

    // TODO Backend validation
    const {
        body: {
            nic, firstName,lastName, dob,
            addressLine1, addressLine2, city, email, telephoneNumber, password
        },
    } = req;

    const hashedPassword = bcrypt.hashSync(password,10);

    try{
        const id = uuid();
        const success = await userModel.createUser(id,nic,firstName,lastName,dob,addressLine1,addressLine2,city,email,telephoneNumber,hashedPassword);
        
        if(success){

            const token = jwt.sign({"id":id},"secret");

            res.json({
                "message":"Success",
                "token": token
            });
        }
    }catch(err){
        res.json({
            "message":"Error",
            "error":err
        });
    }    

};

const signInUserController = async (req,res) => {

    const {body: { nic, password }} = req;
    try {
        const result = await userModel.getUserPassword(nic);
        const isPasswordValid = bcrypt.compareSync(password,result["password"]);
        console.log(isPasswordValid);
        if(isPasswordValid){
            const token = jwt.sign({"id":result["user_id"]},"secret");
            res.json({
                "Message":"Success",
                "token":token
            });
        }else{
            res.json({
                "Message":"Invalid login",

            });
        }
    } catch (error) {
        res.json({
            "Message": "Error",
            "Error": error

        });
        
    }

};


const updateUserController = async (req,res) => {

    console.log(req.body);

    res.json({
        "success":2000, 
        "data":req.body.user
    });

};

const deleteUserController = async (req,res) => {

    res.json({
        "success":200,
        "user":req.user,
        "data":req.body
    });

};


const getUserController = async (req,res) => {

    res.json({
        "success":200,
        "user":req.user,
        "data":req.body
    });

};




module.exports = {signUpUserController,signInUserController,updateUserController,deleteUserController,getUserController};