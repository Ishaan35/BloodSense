const mysql = require("mysql");
require('dotenv').config();
const fs = require('fs')

let inProduction = true;
if (process.env.IN_PRODUCTION && process.env.IN_PRODUCTION === "false")
  inProduction = false;



let poolConfig = null;
console.log(inProduction)

if(inProduction){
  poolConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    database: process.env.DB_NAME,
  };
}
else{
  poolConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: false,
    insecureAuth: true
  };
}

const db = mysql.createPool(poolConfig);

module.exports = db;
