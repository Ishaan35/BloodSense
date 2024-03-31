const { Pool } = require("pg");
require("dotenv").config();
const fs = require("fs");

let inProduction = true;
if (process.env.IN_PRODUCTION && process.env.IN_PRODUCTION === "false")
  inProduction = false;

let poolConfig = null;
console.log(inProduction);

if (inProduction) {
  poolConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
} else {
  poolConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: false,
  };
}

const db = new Pool(poolConfig);

module.exports = db;
