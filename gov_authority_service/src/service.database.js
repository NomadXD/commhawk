const {Pool, Client} = require("pg");

const pool = new Pool({
  user: "commhawk",
  host: "postgres",
  database: "gov_auth",
  password: "password",
  port: "5432"
});

pool.query('SELECT NOW()')

const client = new Client({
  user: "commhawk",
  host: "postgres",
  database: "gov_auth",
  password: "password",
  port: "5432"
})

client.query('SELECT NOW()')

module.exports = pool;