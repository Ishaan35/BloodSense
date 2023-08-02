const { Router } = require("express");
const router = Router();
const multer = require("multer");
require("dotenv").config();
const {uploadDocument, deleteDocumentById, wait} = require('../utils/fileUploadUtils')
const { queryPromise } = require("../utils/queryUtils");

const {encryptFile, decryptFile} = require('../utils/fileEncryption')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
const upload = multer({ storage: storage });
  

module.exports = (passport) =>{


   


    router.post('/document/upload', upload.single('uploadedFile'), async (req, res) =>{


        if(!req.user){
            req.logout((err) => {
              if (err) {
                return next(err);
              }
              res.status(401).send("Unauthorized Request");
              res.end();
              return;
            });
        }

        let uploadedFile = req.file;
        let originalFileName = req.file.originalname;


        const inputFile = `uploads/${originalFileName}`;
        const outputFile = `encrypted/${originalFileName}`;

        try {

            //try encrypting the file first from the uploads path and get its path
            const encryptedFileName = await encryptFile(inputFile, outputFile);

            //the file upload code which uses the original file, but the encrypted file for the upload blob itself
            try{

                //now deal with the data regarding the profile image
               let fileSRC = null;
               if(uploadedFile){
                   try{
   
                       //give the original file so it can extract the details, but we will use the path of the encrypted file as we want to upload the encrypted file as the blob itself
                       //if encryptedFileName is undefined, then the uploadDocument method will authomatically just use the original file's path and upload that (uploadedFile.path)
                       let response = await uploadDocument(uploadedFile,encryptedFileName);
                       let fileIDName = response.replace(process.env.AZURE_BLOB_BASE_URL_DOCUMENTS + "/", "").trim(); //extract just the file name of the image so we hide the details of the blob azure storage and sas key                
                       fileSRC = `${process.env.BASE_SERVER_URL}/files/${fileIDName}`;
   
                       
   
                       //do the sql query
                       const fileRelationQuery = `INSERT INTO ${process.env.DB_NAME}.user_documents (document_id,user_id,document_name, date_added) VALUES (?,?,?, ?)`
                       
                       
   
                       const sqlResponse = await queryPromise(fileRelationQuery, [fileIDName, req.user.id, originalFileName, Date.now()]);
                        
                   }catch(err){
                       console.log(err);
                   }
               }
   
               res.status(200).send("Successfully uploaded document").end();
               return;
           }catch(error){
               console.log(error);
               res.status(500).send("Database Error").end();
               return;
           }
        } catch (err) {
            console.error('Encryption failed:', err);
            res.status(500).send('Encryption failed.');
        }


        
    })


    // router.post('/document/uploadNoEncrypion', upload.single('uploadedFile'), async (req, res) =>{


    //     if(!req.user){
    //         req.logout((err) => {
    //           if (err) {
    //             return next(err);
    //           }
    //           res.status(401).send("Unauthorized Request");
    //           res.end();
    //         });
    //         return;
    //     }

    //     let uploadedFile = req.file;
    //     let originalFileName = req.file.originalname;

    //     console.log(uploadedFile)

    //     try{

    //          //now deal with the data regarding the profile image
    //         let fileSRC = null;
    //         if(uploadedFile){
    //             try{

                    
    //                 let response = await uploadDocument(uploadedFile); ///gives normal azure blob url to us
    //                 console.log(response)
    //                 let fileIDName = response.replace(process.env.AZURE_BLOB_BASE_URL_DOCUMENTS + "/", "").trim(); //extract just the file name of the image so we hide the details of the blob azure storage and sas key                
    //                 fileSRC = `${process.env.BASE_SERVER_URL}/files/${fileIDName}`;
    //                 console.log(fileSRC)

                    

    //                 //do the sql query
    //                 const fileRelationQuery = `INSERT INTO ${process.env.DB_NAME}.user_documents (document_id,user_id,document_name, date_added) VALUES (?,?,?, ?)`
                    
                    

    //                 const sqlResponse = await queryPromise(fileRelationQuery, [fileIDName, req.user.id, originalFileName, Date.now()]);
                     
    //             }catch(err){
    //                 console.log(err);
    //             }
    //         }

    //         res.status(200).send("Successfully uploaded document").end();
    //         return;
    //     }catch(error){
    //         console.log(error);
    //         res.status(500).send("Database Error").end();
    //         return;
    //     }
    // })

    router.post('/document/getAllDocuments', async (req, res) =>{

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

            const query = `SELECT * FROM ${process.env.DB_NAME}.user_documents WHERE user_id = ?`;
            const response = await queryPromise(query, [req.user.id]);

            res.status(200).send(response);
            
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error fetching all documents")
        }

        

    })

    router.post('/document/deleteDocument', async (req, res) =>{
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


        const documentId = req.body.documentId;
        
        //sql query
        try{
            const query = `DELETE FROM ${process.env.DB_NAME}.user_documents WHERE document_id = ?`
            const sqlResponse = await queryPromise(query, [documentId])
        }catch(err){
            console.log(err);
            await wait(2000);
            res.status(500).send("Internal Server Database Error");
            return;
        }

        //blob storage delete
        try{
            await deleteDocumentById(documentId);
        }catch(err){
            console.log(err);
            await wait(2000);
            res.status(500).send("Internal Blob Storage Database Error")
            return;
        }
        await wait(2000);

        res.status(200).send("Successfully deleted document")
    })

    return router;
}