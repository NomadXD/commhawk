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
        let params = []
        params = req.body;
        params.id = id;
        params.hashedPassword = hashedPassword;
        const isRegistered = await govModel.createGovInsititute(params)
        if(isRegistered){
            const documentResponse = await fetch(`http://socket:3000/api/socket/create-document/${id}`).then(res => res.json())
            console.log(documentResponse)
            if(documentResponse.status === 201){
                const token = jwt.sign({"id":id,"type":req.body.type,"status":1},"secret")
                res.status(201).send({
                    "message": "Success",
                    "token": token,
                    "displayName": isRegistered
                })
            }else{
                // TODO remove already saved account to achieve data consistency
                res.status(500).send({
                    "message": "Internal Server Error",
                })

            }
            
        }
    }catch (err){
        console.log(err)
        res.status(500).send({
            "message": "Error",
            "error": err
        })
    }
}

const signInController = async (req,res) => {

    const {
        body: {
            id,password
        },
    } = req;
    let params = [id]
    try{
        let data = await govModel.getLoginInformation(params)
        console.log(data)
        if(data){
            let isPasswordValid = bcrypt.compareSync(password,data["password"])
            if(isPasswordValid){
                let token = jwt.sign({"id":id,"type":data["institute_type"],"status":data["institute_status"]},"secret")
                // TODO fetch incidents
                res.status(200).send({
                    "status": 200,
                    "message": "Login success",
                    "account_status":data["institute_status"],
                    "type":data["institute_type"],
                    "token": token
                })
            }else{
                res.status(401).send({
                    "status":401,
                    "message":"Invalid Password"
                })
        }

        }else{
            res.status(401).send({
                "status":401,
                "message":"Invalid ID"
            })
        }

        
    }catch(err){
        res.status(500).send({
            "status":500,
            "message":"Internal server error"
        })

    }


}


const autoAssignInstituteController = async (req,res) => {

    const location = req.body.location
    const categories  =req.body.categories
    try {
        const relatedInstitutes = await govModel.getRelatedInsitute(location,categories)
        console.log(location)
        console.log(categories)
        res.json({
            "institutes": relatedInstitutes
        })
        
    } catch (error) {
        console.log(error)
    }

    
    

}

const getAllInstituteController = async (req,res) => {
    const institutes = await govModel.getAll()
    res.status(200).send({
        "institutes": institutes
    })
}


module.exports = {signUpController, signInController, autoAssignInstituteController, getAllInstituteController}