const {Pool} = require('pg')

const pool = new Pool({
  user: 'sl_alerts',
  host: 'postgres',
  database: 'user_data',
  password: 'password',
  port: '5432'
});

module.exports = pool;