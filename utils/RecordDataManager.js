const CosmosDBClient = require('./cosmosDBClient');
const { queryPromise } = require('./queryUtils');
const SecretStore = require("../secret/SecretStore");

const createNewRecord = async (data) =>{
    try{
        const container = CosmosDBClient.database(SecretStore.GetSecret("AZURE_COSMOS_DB_ID")).container(SecretStore.GetSecret("AZURE_COSMOS_CONTAINER_ID"));


        const { resource: createdDocument } = await container.items.create(data);
    
        return createdDocument;
    }catch(err){
        return err;
    }    
}

const updateExistingRecord = async (data, userID) =>{
    try{
        const container = CosmosDBClient.database(SecretStore.GetSecret("AZURE_COSMOS_DB_ID")).container(SecretStore.GetSecret("AZURE_COSMOS_CONTAINER_ID"));

        data.UserID = userID;

        //check for custom biomarkers

        const query = `SELECT custom_biomarker_list FROM custom_biomarkers WHERE user_id = $1`;
        const response = await queryPromise(query, [userID]);
        let old_custom_biomarkers_list = JSON.parse(response[0].custom_biomarker_list);


        let customBiomarkers = [];
        data.formElements.forEach(formElement => {
            if(!formElement.measureOptions.length || formElement.measureOptions.length === 0 && formElement.customUnitMeasure && formElement.customUnitMeasure !== ''){
                customBiomarkers.push({biomarker: formElement.biomarker, measure: [formElement.customUnitMeasure]});
            }
        });

        customBiomarkers.forEach(customBio => {
            // Check if the property of the current item in array 2 exists in any item of array 1
            const biomarkersWithSameName = old_custom_biomarkers_list.filter(
                old => old["biomarker"] === customBio["biomarker"]
            );
        
            // If none of the items in array 1 has the same property, merge the item from array 2 into array 1
            if (biomarkersWithSameName.length  === 0) {
              old_custom_biomarkers_list.push(customBio);
            }
            else{
                for(let i = 0; i < biomarkersWithSameName.length; i++){
                    let duplicateBiomarker = biomarkersWithSameName[i];

                    if(duplicateBiomarker["measure"].indexOf(customBio["measure"][0]) <= 0){
                        let foundObjIndex = old_custom_biomarkers_list.findIndex(old => old["biomarker"] === customBio["biomarker"])
                        old_custom_biomarkers_list[foundObjIndex]["measure"].push(customBio["measure"][0])
                    }
                }
            }
        });
        

        //update biomarker list
        await queryPromise(`UPDATE custom_biomarkers SET custom_biomarker_list = $1 WHERE user_id = $2`, [JSON.stringify(old_custom_biomarkers_list),userID]);
        const { resource: updatedDocument } = await container.item(data.id, userID).replace(data);
    
        return updatedDocument;
    }catch(err){
        return err;
    }    
}

const deleteExistingRecord = async (data, userID) =>{
    try{
        const container = CosmosDBClient.database(SecretStore.GetSecret("AZURE_COSMOS_DB_ID")).container(SecretStore.GetSecret("AZURE_COSMOS_CONTAINER_ID"));
        await container.item(data.id, userID).delete();


        //delete the sql entry too!
        const query = `DELETE FROM user_records WHERE id = $1`;
        await queryPromise(query, [data.id])

        return true;
    }catch(err){
        console.log(err)
        throw new Error("Error deleting record")
    }    
}

const getRecordByRecordID = async (recordID, userID) =>{
    const container = CosmosDBClient.database(SecretStore.GetSecret("AZURE_COSMOS_DB_ID")).container(SecretStore.GetSecret("AZURE_COSMOS_CONTAINER_ID"));

    try{
        const { resource: document } = await container.item(recordID, userID).read();
        return document;
    }catch(err){
        return err;
    }
}

const getAllUserRecordsMax50 = async (userID) =>{
    const query = `SELECT id, "inTrash", record_name, date_edited FROM user_records WHERE user_id = $1 ORDER BY date_edited DESC`;

    //getting only record id and other essential details. Not the JSON details of the form itself.
    try{
        const response = await queryPromise(query, [userID]);
        return response;
    }
    catch(err){
        console.log(err);
        return err;
    }
}



module.exports = {createNewRecord, getRecordByRecordID, updateExistingRecord, getAllUserRecordsMax50,deleteExistingRecord}