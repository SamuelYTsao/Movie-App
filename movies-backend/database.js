

const mysql2 = require('mysql2');
const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "TS@o1089",
  database: "grocery-db",
  connectionLimit: 10
});

module.exports = { pool };