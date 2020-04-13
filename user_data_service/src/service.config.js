const {Pool} = require("pg");

const pool = new Pool({
  user: "commhawk",
  host: "postgres",
  database: "user_data",
  password: "password",
  port: "5432"
});

module.exports = pool;