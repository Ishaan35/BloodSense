const { Router } = require("express");
const router = Router();
const {wait} = require('../utils/fileUploadUtils')
require('dotenv').config();
const { uuid } = require("uuidv4");
const {createNewRecord, getRecordByRecordID, updateExistingRecord, getAllUserRecordsMax50, deleteExistingRecord} = require('../utils/RecordDataManager');
const { queryPromise } = require("../utils/queryUtils");

//basically some of these operations happen in the viewAllRecords page in next.js and this means we dont have to explicitly deal with cosmos db data, but more so the SQL relation mapping data which is much lighter, consisting of only the essential data such as the record id, record name, user_id who created the record, and inTrash indicator, and date_edited indicator. 
//this makes operations like fetching all records more efficient since we only fetch data we need. Azure cosmos db has a fetch limit of 2MB, which can esily be passed if we keep fetching multiple FULL documents

module.exports = (passport) =>{


    router.post('/records/createNewRecord', async (req,res) =>{

        if(!req.user){
            req.logout((err) => {
              if (err) {
                return next(err);
              }
              res.status(401).send("Unauthorized Request");
              res.end();
            });
            return;
        }
        

        const defaultRecordData = {
            RecordID: uuid(),
            UserID: req.user.id,
            recordName: 'Untitled Record',
            recordDate: new Date().toISOString().split('T')[0],
            formElements: [],
        }

        //create record on cosmos DB
        try{

            //cosmos db request
            const response= await createNewRecord(defaultRecordData)

            //sql db relation insert
            try{
              const query = `INSERT INTO ${process.env.DB_NAME}.user_records (id, user_id, inTrash, record_name, date_edited) VALUES (?,?,?,?,?)`
              await queryPromise(query, [response.id, req.user.id, 0, response.recordName, Date.now()]);
            }catch(err){
              console.log(err);
            }


            //return the data
            res.status(200).send(response).end();
            return;

        }catch(err){
            res.status(500).send(err).end();
            return;
        }
    })

    router.post('/records/saveRecordTrashStatus', async (req, res) =>{
        if(!req.user){
          req.logout((err) => {
            if (err) {
              return next(err);
            }
            res.status(401).send("Unauthorized Request");
            res.end();
          });
          return;
        }

        const recordData = req.body.RecordData;
        
        //just an sql query

        const query = `UPDATE ${process.env.DB_NAME}.user_records SET inTrash = ? WHERE id = ?`;
        try{
          await queryPromise(query, [recordData.inTrash, recordData.id]);

          res.status(200).send("Successfully Updated Trash Status");
        }catch(err){
          console.log(err);
          res.status(500).send("Internal Server Error");
        }


    })


    router.post('/records/saveRecord', async (req, res) =>{
        
        if(!req.user){
            req.logout((err) => {
              if (err) {
                return next(err);
              }
              res.status(401).send("Unauthorized Request");
              res.end();
            });
            return;
        }
        const recordData = req.body.RecordData;
        const updatedDocument = await updateExistingRecord(recordData, req.user.id)

        //sql relation update

        //sql db relation update
        try{
          const query = `UPDATE ${process.env.DB_NAME}.user_records SET record_name = ?, date_edited = ? WHERE id = ?`;
          await queryPromise(query, [recordData.recordName, Date.now(), recordData.id]);
        }catch(err){
          console.log(err);
        }

        await wait(2000);
        res.status(200).send("Form Successfully Saved");
    })

    router.post('/records/deleteRecord',async (req, res) =>{
        
      if(!req.user){
          req.logout((err) => {
            if (err) {
              return next(err);
            }
            res.status(401).send("Unauthorized Request");
            res.end();
          });
          return;
      }
      const recordData = req.body.RecordData;
      try{
        const deleted = await deleteExistingRecord(recordData, req.user.id)
      }catch(err){
        await wait(2000);
        res.status(500).send("Error Deleting Record")
        return;
      }
      await wait(2000);
      res.status(200).send("Form Successfully Deleted");
    })

    router.post('/records/getRecordByRecordID', async (req, res) =>{

      if(!req.user){
        req.logout((err) => {
          if (err) {
            return next(err);
          }
          res.status(401).send("Unauthorized Request");
          res.end();
        });
        return;
      }

      
      try{
        const data = await getRecordByRecordID(req.body.RecordID, req.user.id);
        res.status(200).send(data).end();
        return;
      }catch(err){
        console.log(err)
        res.status(500).send(err).end();
        return;
      }
      
    })

    router.post('/records/getAllRecords', async (req, res) =>{

      if(!req.user){
        req.logout((err) => {
          if (err) {
            return next(err);
          }
          res.status(401).send("Unauthorized Request");
          res.end();
        });
        return;
      }
      const data = await getAllUserRecordsMax50(req.user.id);
      
      res.status(200).send(data);
    })

    router.get('/records/getCustomBiomarkers', async (req, res) =>{


      if(!req.user){
        req.logout((err) => {
          if (err) {
            return next(err);
          }
          res.status(401).send("Unauthorized Request");
          res.end();
        });
        return;
      }

      let old_custom_biomarkers_list = [];
      try{
        const query = `SELECT custom_biomarker_list FROM ${process.env.DB_NAME}.custom_biomarkers WHERE user_id = ?`;
        const response = await queryPromise(query, [req.user.id]);
        old_custom_biomarkers_list = JSON.parse(response[0].custom_biomarker_list);
        res.status(200).send(old_custom_biomarkers_list);
      }catch(err){
        console.log(err);
        res.status(500).send("There was an error fetching custom biomarker data")
      }

    })

    return router;
}