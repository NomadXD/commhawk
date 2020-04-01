const pool = require('./service.config')

const createUserController = async (req,res) => {

    res.json({
        "success":200
    })


}

module.exports = {createUserController};