const { Pool } = require("pg");
require("dotenv").config();
const fs = require("fs");
const { isProduction } = require("../utils/isProduction");
const SecretStore = require("../secret/SecretStore");


let poolConfig = null;
console.log("isProduction: " + isProduction());

if (isProduction()) {
  poolConfig = {
    connectionLimit: 10,
    host: SecretStore.GetSecret("DB_HOST"),
    user: SecretStore.GetSecret("DB_USER"),
    password: SecretStore.GetSecret("DB_PASSWORD"),
    database: SecretStore.GetSecret("DB_NAME"),
    port: SecretStore.GetSecret("DB_PORT") || 5432,
  };
} else {
  poolConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST || SecretStore.GetSecret("DB_HOST"),
    user: process.env.DB_USER || SecretStore.GetSecret("DB_USER"),
    password: process.env.DB_PASSWORD || SecretStore.GetSecret("DB_PASSWORD"),
    database: process.env.DB_NAME || SecretStore.GetSecret("DB_NAME"),
    port: process.env.DB_PORT || SecretStore.GetSecret("DB_PORT") || 5432,
    ssl: false,
  };
}

const db = new Pool(poolConfig);
module.exports = db;
