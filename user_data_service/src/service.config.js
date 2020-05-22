const {Pool} = require("pg");

let DATABASE_URL = "postgres://commhawk_test:password@localhost:5432/userdata";

if (process.env.DATABASE_URL){
  DATABASE_URL = process.env.DATABASE_URL;
}

const pool = new Pool({
  connectionString: DATABASE_URL
  // user: "commhawk",
  // host: "postgres",
  // database: "user_data",
  // password: "password",
  // port: "5432"
});

module.exports = pool;