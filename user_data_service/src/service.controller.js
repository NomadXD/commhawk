const pool = require('./service.config')

const test = async () => {

    let result = await pool.query("INSERT INTO test values ('2','Lahiru','lahiru@gmail.com');")
    console.log(result)

}

module.exports = test;