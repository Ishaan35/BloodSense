const CosmosDBClient = require('./cosmosDBClient');
require('dotenv').config();

const getSingleBiomarkerDataAcrossRecords = async (selectedBiomarker, minimumDate, userID) =>{
    const container = CosmosDBClient.database(process.env.AZURE_COSMOS_DB_ID).container(process.env.AZURE_COSMOS_CONTAINER_ID);

    const queryStr = 
        `
            SELECT 
                c.recordDate, 
                c.recordName, 
                formElement.selectedMeasure,
                formElement.measuredValue
            
            FROM 
                c
            JOIN 
                formElement IN c.formElements
            WHERE
                c.UserID = @UserID AND formElement.biomarker = @selectedBiomarker AND c.recordDate >= @minimumDate
        `
    const querySpec = {
        query: queryStr,
        parameters: [
            {name: "@UserID", value: userID},
            {name: "@selectedBiomarker", value: selectedBiomarker},
            {name: "@minimumDate", value: minimumDate}
        ]
    };

    const {resources: results} = await container.items.query(querySpec).fetchAll();
    return results;
}

const getRecordFormelementValues = async (userID, recordIDs) => {
    const container = CosmosDBClient.database(
      process.env.AZURE_COSMOS_DB_ID
    ).container(process.env.AZURE_COSMOS_CONTAINER_ID);

  const idsString = recordIDs.map((id) => `'${id}'`).join(",");
  const dynamicQuery = `
    SELECT VALUE {
    "id": c.id,
    "recordName": c.recordName,
    "recordDate": c.recordDate,
    "formElements": ARRAY(SELECT {
            "biomarker": elem.biomarker,
            "selectedMeasure": elem.selectedMeasure,
            "measuredValue": elem.measuredValue
            }
            FROM elem IN c.formElements
        )
    }
    FROM c
    WHERE c.id IN (${idsString}) AND c.UserID = '${userID}'`;
    
    const { resources: results } = await container.items
      .query(dynamicQuery)
      .fetchAll();
      
    return results;
};

module.exports = {
  getSingleBiomarkerDataAcrossRecords,
  getRecordFormelementValues,
};