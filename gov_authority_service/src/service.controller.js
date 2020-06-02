const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid/v4");
const govModel = require("./service.model");
const fetch = require("node-fetch");

const signUpController = async (req,res) => {

    // TODO backend validation

    const hashedPassword = bcrypt.hashSync(req.body.password,10);

    try{
        const id = uuid();
        let params = [];
        params = req.body;
        params.id = id;
        params.hashedPassword = hashedPassword;
        const isRegistered = await govModel.createGovInsititute(params);
        if(isRegistered){
            const documentResponse = await fetch(`http://socket:3000/api/socket/create-document/${id}`).then(res => res.json());
            console.log(documentResponse);
            if(documentResponse.status === 201){
                const token = jwt.sign({"id":id,"type":req.body.type,"status":1},"secret");
                res.status(201).send({
                    "message": "Success",
                    "id":id,
                    "token": token,
                    "displayName": isRegistered,
                    "type":req.body.type,
                    "status":201
                });
            }else{
                // TODO remove already saved account to achieve data consistency
                res.status(500).send({
                    "status":500,
                    "message": "Internal Server Error",
                });

            }
            
        }else{
            res.status(406).send({
                "status":406,
                "message": "Not accepted"
            });
        }
    }catch (err){
        if(err.code === "23505"){
            res.status(200).send({
                "status":200,
                "message": "Institute already exist"
            });
        }else{
            res.status(500).send({
                "status":500,
                "message": "Internal Server Error"
            });

        }
        
    }
};

const signInController = async (req,res) => {

    const {
        body: {
            id,password
        },
    } = req;
    let params = [id];
    try{
        let data = await govModel.getLoginInformation(params);
        if(data){
            let isPasswordValid = bcrypt.compareSync(password,data["password"]);
            if(isPasswordValid){
                let token = jwt.sign({"id":id,"type":data["institute_type"],"status":data["institute_status"]},"secret");
                // TODO fetch incidents
                if(data["institute_status"] === 2){
                    const documentResponse = await fetch(`http://socket:3000/api/socket/get-incidents/${id}`).then(res => res.json());
                    console.log(documentResponse);
                    res.status(200).send({
                        "status": 200,
                        "id":id,
                        "message": "Login success",
                        "account_status":data["institute_status"],
                        "type":data["institute_type"],
                        "token": token,
                        "incidents": documentResponse
                    });
                }else{
                    res.status(200).send({
                        "status": 200,
                        "id":id,
                        "message": "Login success",
                        "account_status":data["institute_status"],
                        "type":data["institute_type"],
                        "token": token
                    });

                }
                
            }else{
                res.status(401).send({
                    "status":401,
                    "message":"Invalid Password"
                });
        }

        }else{
            res.status(401).send({
                "status":401,
                "message":"Invalid ID"
            });
        }

        
    }catch(err){
        res.status(500).send({
            "status":500,
            "message":"Internal server error"
        });

    }


};


const autoAssignInstituteController = async (req,res) => {

    const location = req.body.location;
    const categories  =req.body.categories;
    try {
        const relatedInstitutes = await govModel.getRelatedInsitute(location,categories);
        console.log(location);
        console.log(categories);
        res.json({
            "institutes": relatedInstitutes
        });
        
    } catch (error) {
        console.log(error);
    }

    
    

};

const getAllInstituteController = async (req,res) => {
    const institutes = await govModel.getAll();
    res.status(200).send({
        "status":200,
        "message":"Success",
        "institutes": institutes
    });
};

const getInstituteInfoController = async (req,res) => {
    const instituteInfo = await govModel.getInstituteInfo(req.body.id,req.body.category);
    if(instituteInfo){
        instituteInfo.st_asgeojson = JSON.parse(instituteInfo.st_asgeojson);
        res.status(200).send({
            "status":200,
            "instituteInfo":instituteInfo
        });
    }else{
        res.status(404).send({
            "status":404,
            "message":"No institute matches the given ID"
        });
    }

};


const updateInstituteContactController = async (req, res) => {

    const updated = await govModel.updateInstituteContact(req.body);
    if(updated){
        res.status(201).send({
            "status":201,
            "message":"Contact details successfully updated"
        });
    }else{
        res.status(200).send({
            "status":200,
            "message":"Contact details update unsuccessful"
        });
    }

};


const updateInstituteLocationController = async (req, res) => {

    const updated = await govModel.updateLocation(req.body);
    if(updated){
        res.status(201).send({
            "status":201,
            "message":"Location details successfully updated"
        });
    }else{
        res.status(200).send({
            "status": 200,
            "message": "Location update failed"
        });
    }
};


const updateInstituteInfoController = async (req, res) => {

    const updated = await govModel.updateInstituteInfo(req.body);
    if(updated){
        res.status(201).send({
            "status":201,
            "message":"Information updated successfully"
        });
    }else{
        res.status(200).send({
            "status":200,
            "messages":"Information update unsuccessful"
        });
    }
};

const getUnverifiedController = async (req,res) => {

    const type = req.body.token.type;
    const institutes = await govModel.getUnverifiedInstitutes(type);
    res.status(200).send({
        "status":200,
        "institutes":institutes
    });

};

const verifyHQController = async (req,res) => {

    const instituteId = req.params.instituteId;
    const isVerified = await govModel.verifyInstitute(instituteId);
    if(isVerified){
        res.status(200).send({
            "status":200,
            "message":"Successfully verified"
        });
    }else{
        res.status(500).send({
            "status":500,
            "message":"Internal server error"
        });
    }


};

const changePasswordController = async (req, res) => {
    const loginData = await govModel.getLoginInformation([req.body.token.id]);
    const isValidPassword = bcrypt.compareSync(req.body.oldPassword, loginData.password);
    if(isValidPassword){
        const newHashedPassword = bcrypt.hashSync(req.body.newPassword,10);
        const isPasswordChanged = await govModel.changeInstitutePassword(newHashedPassword, req.body.token.id);
        if(isPasswordChanged){
            res.status(201).send({
                "status":201,
                "message":"Password changed"
            });
        }else{
            res.status(500).send({
                "status":500,
                "message":"Internal server error"
            });
        }
    }else{
        res.status(401).send({
            "status":401,
            "message":"Unauthorized"
        });
    }

};

const analyticsTokenController = async (req, res) => {
    console.log(req.body.token);
    try {
        const data = await govModel.analyzeTokens(req.body.token.type, req.body.startDate, req.body.endDate);
        res.status(200).send({
            "status":200,
            "results": data
        });
    } catch (error) {
        res.status(500).send({
            "status":500,
            "message":"Internal server error"
        });
    }

};




module.exports = {signUpController, signInController, autoAssignInstituteController, getAllInstituteController, 
                getInstituteInfoController, getUnverifiedController,verifyHQController, updateInstituteContactController,
                updateInstituteLocationController, updateInstituteInfoController, changePasswordController,
                analyticsTokenController};