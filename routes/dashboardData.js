const { Router } = require("express");
const router = Router();

const { queryPromise } = require("../utils/queryUtils");


module.exports = (passport) =>{

    
    router.post("/dashboard/getInitData", async (req, res) =>{
        if (!req.user) {
            req.logout((err) => {
                if (err) {
                    return next(err);
                }
                res.status(401).send("Unauthorized Request");
                res.end();
            });
            return;
        }
        
        //otherwise get the recent documents and recent records from sql db
        const recordQuery = `SELECT id, record_name FROM user_records WHERE user_id = $1 ORDER BY date_edited DESC LIMIT 3`;
        const documentQuery = `SELECT document_id, document_name FROM user_documents WHERE user_id = $1 ORDER BY date_added DESC LIMIT 3`;
        
        try{

            const recordDataResponse = await queryPromise(recordQuery, [req.user.id]);
            const recordDocumentResponse = await queryPromise(documentQuery, [req.user.id]);

            res.status(200).send({
                recentRecords: recordDataResponse,
                recentDocuments: recordDocumentResponse
            })
        }catch(err){
            res.status(500).send("Internal Server Error").end();
            return;
        }

    })
    return router;
}