const {Pool, Client} = require("pg");

const pool = new Pool({
  user: "commhawk",
  host: "postgres",
  database: "gov_auth",
  password: "password",
  port: "5432"
});

let result = await pool.query('SELECT NOW()')
console.log(result)


const client = new Client({
  user: "commhawk",
  host: "postgres",
  database: "gov_auth",
  password: "password",
  port: "5432"
})

let cresult = await client.query('SELECT NOW()')
console.log(cresult)

module.exports = pool;