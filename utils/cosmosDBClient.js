const { CosmosClient } = require("@azure/cosmos");
const SecretStore = require("../secret/SecretStore");

const CosmosDBClient = new CosmosClient(SecretStore.GetSecret("AZURE_COSMOS_DB_PRIMARY_CONNECTION_STRING"));

module.exports = CosmosDBClient;
