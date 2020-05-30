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

            res.status(200).send({
                "status":200,
                "message":"Success",
                "token":token,
                "id":id
            });
        }
    }catch(err){
        res.status(406).send({
            "status":406,
            "message":"Invalid details"
        });
    }    

};

const signInUserController = async (req,res) => {

    const {body: { nic, password }} = req;
    try {
        const result = await userModel.getUserPassword(nic);
        if(result){
            const isPasswordValid = bcrypt.compareSync(password,result["password"]);
            if(isPasswordValid){
                const token = jwt.sign({"id":result["user_id"]},"secret");
                res.status(200).send({
                    "status":200,
                    "message":"Success",
                    "token":token,
                    "id":result["user_id"]
                });
            }else{
                res.status(401).send({
                    "status":401,
                    "message":"Invalid password"
                });
            }
        }else{
            res.status(406).send({
                "status":406,
                "message":"Invalid NIC number"
            });
        }
        
    } catch (error) {
        res.status(500).send({
            "status":500,
            "message":"Internal server error"
        });
        
    }

};


const updateUserController = async (req,res) => {

    const {body: { addressLine1, addressLine2, city, email, telephoneNumber }} = req;
    try{
        const isUpdated = await userModel.updateUserDetails(addressLine1, addressLine2, city, email, telephoneNumber, req.body.user.id);

        if(isUpdated){
            res.status(201).send({
                "status":201,
                "message":"User details successfully updated"
            });
         }else{
             res.status(500).send({
                 "status":500,
                 "message":"User details update unsuccessful. Try again later"
             });
         }
    }catch (err){
        res.status(500).send({
            "status":500,
            "message":"Internal server error"
        });
    }

    

    

};

const deleteUserController = async (req,res) => {
   const user = await userModel.getUserPassword(req.body.nic);
   if(user){
        const isValid = bcrypt.compareSync(req.body.password,user.password);
        if(isValid){
            const isDeleted = await userModel.deleteUser(req.body.user.id);
            if(isDeleted){
                res.status(201).send({
                    "status":201,
                    "message":"User deleted successfully"
                });
            }else{
                res.status(500).send({
                    "status": 500,
                    "message":"User deletion failed"
                });
            }
        }else{
            res.status(401).send({
                "status":401,
                "message":"Unauthorized"
            });
        }
    
   }else{
       res.status(500).send({
           "status":401,
           "message":"Unauthorized"
       });
   } 
   

};


const getUserController = async (req,res) => {

    try{
        const data = await userModel.getUserDetails(req.params.userId);
        if(data){
            res.status(201).send({
                "status":201,
                "message":"Success",
                "userdata": data
            });
        }else{
            res.status(200).send({
                "status":200,
                "message":"User not found"
            });
        }

    }catch (err){
        res.status(500).send({
            "status":500,
            "message":"Internal server error"
        });
    }

};

const checkUserExistenceController = async (req,res) => {
    const userExist = await userModel.checkUserExistence(req.params.userId);
    if (userExist){
        res.status(201).send({
            "status":201,
            "message":"User exists"
        });
    }else{
        res.status(200).send({
            "status":200,
            "message":"User does not exist"
        });
    }
};

const changePasswordController = async (req,res) => {
    
    const user = await userModel.getUserPassword(req.body.nic);
    if(user){
        const passwordVerified = bcrypt.compareSync(req.body.oldPassword,user.password);
        if(passwordVerified){
            const newHashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
            const passwordChanged = await userModel.changePassword(req.body.user.id, newHashedPassword);
            if (passwordChanged){
                res.status(201).send({
                    "status":201,
                    "message":"Password changed"
                });
            }else{
                res.status(500).send({
                    "status":500,
                    "message":"Password change failed"
                });
            }
        }else{
            res.status(401).send({
                "status": 401,
                "message": "Unauthorized"
            });
        }    

    }else{
        res.status(401).send({
            "status":401,
            "message":"Unauthorized"
        });
    }

    

};




module.exports = {signUpUserController,signInUserController,updateUserController,deleteUserController,getUserController, checkUserExistenceController, changePasswordController};