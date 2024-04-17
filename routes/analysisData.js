const { Router } = require("express");
const router = Router();
const {
  getSingleBiomarkerDataAcrossRecords,
  getRecordFormelementValues,
} = require("../utils/analysisDataUtils");

module.exports = (passport) =>{

    router.post("/analysis/getBiomarkerFromEveryRecord", async (req, res) =>{

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
        
        let selectedBiomarker = req.body.selectedBiomarker;
        let minimumDate = req.body.minimumDate;

        const dataArr = await getSingleBiomarkerDataAcrossRecords(selectedBiomarker, minimumDate, req.user.id)

        res.send(dataArr);
    });

    router.post(`/analysis/getBiomarkerFormelementValues`, async (req, res) =>{
      if (!req.user) {
        req.logout((err) => {
          if (err) {
            return next(err);
          }
          res.status(401).send("Unauthorized Request").end();
          return;
        });
      }
      else{
        try{
          const result = await getRecordFormelementValues(req.user.id, req.body.recordIds);
          console.log(result)
          res.status(200).send(result);
        }catch(err){
          res.status(500).send(err).end();
        }
      }
    })

    return router;
}