const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid/v4");
const govModel = require("./service.model");

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
            const token = jwt.sign({"id":id,"type":type},"secret")
            res.status(201).send({
                "message": "Success",
                "token": token
            })
        }
    }catch (err){
        res.status(500).send({
            "message":err
        })
    }




}

const signInController = async (req,res) => {

}


module.exports = {signUpController, signInController}