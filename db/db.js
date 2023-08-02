const mysql = require("mysql");
require('dotenv').config();
const fs = require('fs')

const serverCa = [
  fs.readFileSync("./DigiCertGlobalRootCA.crt.pem", "utf8"),
];


const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: serverCa,
  },
});

module.exports = db;
