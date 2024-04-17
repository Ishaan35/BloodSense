const { Router } = require("express");
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { getDocumentUrlFromFileName } = require("../utils/fileUploadUtils");
const fetch = require("node-fetch");
const { queryPromise } = require("../utils/queryUtils");
const {decryptFile} = require('../utils/fileEncryption')
const fs = require('fs')


module.exports = (passport) =>{

    router.get("/files/:fileName", async (req, res) =>{

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

        const fileName = req.params.fileName;

        //first do an sql query to see if the user actually owns this file

        const verifyRecordQuery = `SELECT * FROM user_documents WHERE document_id = $1 AND user_id = $2`;
        const response = await queryPromise(verifyRecordQuery, [fileName, req.user.id])
        
        //if no relation exists, dont serve the document
        if(response.length !== 1){
            req.logout((err) => {
                if (err) {
                  return next(err);
                }
                res.status(401).send("Unauthorized Request");
                res.end();
              });
              return;
        }
            

        const fileURL = getDocumentUrlFromFileName(fileName);

        try {
          // Fetch the document from the modified URL on the server
          //this response is an encrypted file. We need to decrypt it first
          const response = await fetch(fileURL);
          const tempDecryptedFile = 'decrypted/decryptedFile.pdf'; //destination of decrypted file



          
          //the decrypted file will be written to that location
          try {
            await decryptFile(response.body, tempDecryptedFile); // decryptFile will accept a readable stream as input, which is present in the response.body
          } catch (error) {
            console.error("Error decrypting file:", error);
            res.status(500).send("Error decrypting file");
            return;
          }

          res.set("Content-Disposition", "inline"); // Instructs the browser to display the document


          // Stream the pdf content from the modified URL to the client response
          //since we cant use response directly since it is encrypted, we need to read the decrypted file first, and then pipe it
          fs.createReadStream(tempDecryptedFile).pipe(res);
        } catch (error) {
            console.error("Error serving image:", error);
            res.status(500).send("Error serving image");
        }
    });

    return router;
}