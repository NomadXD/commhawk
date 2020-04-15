const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid/v4");
const govModel = require("./service.model");
const fetch = require("node-fetch");

const signUpController = async (req,res) => {

    // TODO backend validation

    const {
        body: {
            type,addressLine1,addressLine2,city,
            district, province, location, email, telephoneNumber, fax, password
        },
    } = req;

    const hashedPassword = bcrypt.hashSync(password,10);

    try{
        const id = uuid();
        const params = [id,type,addressLine1,addressLine2,city,district,province,location['lng'],location['lat'],email,telephoneNumber,fax,hashedPassword]
        const isRegistered = await govModel.createGovInsititute(params)
        if(isRegistered){
            const documentResponse = await fetch(`http://socket:3000/api/socket/create-document/${id}`).then(res => res.json())
            console.log(documentResponse)
            if(documentResponse.status === 201){
                const token = jwt.sign({"id":id,"type":type,"status":1},"secret")
                res.status(201).send({
                    "message": "Success",
                    "token": token
                })
            }else{
                // TODO remove already saved account to achieve data consistency
                res.status(500).send({
                    "message": "Internal Server Error",
                })

            }
            
        }
    }catch (err){
        res.status(500).send({
            "message": "Error",
            "error": err
        })
    }




}

const signInController = async (req,res) => {

}


module.exports = {signUpController, signInController}