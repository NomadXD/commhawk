const {Pool} = require("pg");

const pool = new Pool({
  user: "commhawk",
  host: "postgres",
  database: "gov_auth",
  password: "password",
  port: "5432"
});

module.exports = pool;