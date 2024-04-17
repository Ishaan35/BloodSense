const { Router } = require("express");
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { getUrlFromFileName } = require("../utils/fileUploadUtils");
const fetch = require("node-fetch");


module.exports = (passport) =>{

    router.get("/images/:imageName", async (req, res) =>{
        const imageName = req.params.imageName;
        const imageURL = getUrlFromFileName(imageName);

        try {
          // Fetch the image from the modified URL on the server
          const response = await fetch(imageURL);

          // Set the appropriate headers for the client response
          res.set("Content-Disposition", "inline"); // Instructs the browser to display the image
          // Stream the image content from the modified URL to the client response
          response.body.pipe(res);
        } catch (error) {
            console.error("Error serving image:", error);
            res.status(500).send("Error serving image");
        }
    });
    return router;
}