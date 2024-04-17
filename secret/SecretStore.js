const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
require("dotenv").config();
require("dotenv").config({ path: ".env.localoverride" }); 

let SECRETS;
let initialized = false;

const region = "us-east-2"
const secret_name = "bloodsense-secrets"; //region for secret is us-east-2


async function GetBasicRestApiSecretsFromRole() {
    const client = new SecretsManagerClient({
      region: region,
    });
    response = await client.send(
        new GetSecretValueCommand({
            SecretId: secret_name,
            VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        })
    );
    return response;
}
async function GetBasicRestApiSecretsFromIamUser() {

    if(!process.env.AWS_SECRET_MANAGER_IAM_ACCESS_KEY_ID || !process.env.AWS_SECRET_MANAGER_IAM_SECRET_ACCESS_KEY_ID)
        throw new Error("Error: IAM user credentials not found!");
    const client = new SecretsManagerClient({
      region: region,
      credentials: {
        accessKeyId: process.env.AWS_SECRET_MANAGER_IAM_ACCESS_KEY_ID,
        secretAccessKey:
          process.env.AWS_SECRET_MANAGER_IAM_SECRET_ACCESS_KEY_ID,
      },
    });
    response = await client.send(
        new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        })
    );
    return response;
}
async function initialize() {
    let response;

    //checks if app is running on ec2 and if it should use IAM role to fetch from secrets manager, or use IAM user as fallback
    try{
      console.log("Trying to fetch from IAM role")
      response = await GetBasicRestApiSecretsFromRole();
    }catch(err){
      console.log("Error fetching from IAM role, trying IAM user")
      response = await GetBasicRestApiSecretsFromIamUser();
    }
    SECRETS = JSON.parse(response.SecretString);

    //overrides
    if(process.env.BASE_CLIENT_URL)
      SECRETS["BASE_CLIENT_URL"] = process.env.BASE_CLIENT_URL;
    if (process.env.BASE_SERVER_URL)
      SECRETS["BASE_SERVER_URL"] = process.env.BASE_SERVER_URL;

    initialized = true;
    //initializeEnvironmentWithSecrets();
}
async function verify() {
  if (!initialized) {
    throw new Error(
      "Error: Must initialize secret store before requesting secrets"
    );
  }
}
async function initializeEnvironmentWithSecrets(){
  verify();
  for(let key in SECRETS){
    process.env[key] = SECRETS[key];
  }
}

function GetSecret(key) {
  verify();
  return SECRETS[key];
}

module.exports = { initialize, GetSecret };
