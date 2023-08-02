const { CosmosClient } = require("@azure/cosmos");
require('dotenv').config()

const CosmosDBClient = new CosmosClient(process.env.AZURE_COSMOS_DB_PRIMARY_CONNECTION_STRING);

module.exports = CosmosDBClient;
