const { Router } = require("express");
const router = Router();
const {queryPromise} = require('../utils/queryUtils')
require('dotenv').config();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {uploadProfileImage} = require('../utils/fileUploadUtils')


module.exports = (passport) =>{

    router.post('/profile/changes', upload.single('profileImage'), async (req, res) =>{

        const oldUser = req.user;

        if(!oldUser){
            req.logout((err) => {
              if (err) {
                return next(err);
              }
              res.status(401).send("Unauthorized Request");
              res.end();
            });
            return;
        }

        let updatedUserInfo = JSON.parse(req.body.updatedUserInfo);
        let profileImage = req.file;

        try{

            updatedUserInfo.age = parseInt(updatedUserInfo.age);
            if(updatedUserInfo.age >= 128)
                updatedUserInfo.age = 127;
            if(updatedUserInfo.age < 0)
                updatedUserInfo.age = 0;
            
            if (
              (updatedUserInfo && updatedUserInfo.first_name.length < 2) ||
              (updatedUserInfo.last_name && updatedUserInfo.last_name.length < 2)
            ) {
              throw new Error("Invalid User Data");
            }
            if(updatedUserInfo.first_name.length >= 50){
                updatedUserInfo.first_name.slice(0,49);
            }
            if (updatedUserInfo.last_name && updatedUserInfo.last_name.length >= 50) {
              updatedUserInfo.last_name.slice(0, 49);
            }

            updatedUserInfo.weight_kg = parseFloat(updatedUserInfo.weight_kg);
            updatedUserInfo.weight_kg.toFixed(2);
            updatedUserInfo.height_cm = parseFloat(updatedUserInfo.height_cm);
            updatedUserInfo.weight_kg.toFixed(1);

            if(isNaN(updatedUserInfo.weight_kg)) updatedUserInfo.weight_kg = null;
            if(isNaN(updatedUserInfo.height_cm)) updatedUserInfo.height_cm = null;
            if(isNaN(updatedUserInfo.age)) updatedUserInfo.age = null;

        }catch(err){
            console.log(err);
            res.status(400).send("Invalid Information").end();
            return;
        }
        const updateUserInfoQueryWithImage = `UPDATE users 
                            SET email = $1, 
                                first_name = $2, 
                                last_name = $3, 
                                age = $4, 
                                height_cm = $5, 
                                weight_kg = $6,
                                profile_img = $7 
                            WHERE username = $8`;
        

        try{

             //now deal with the data regarding the profile image
            let imageSRC = null;
            if(profileImage){
                if(!profileImage.mimetype.startsWith('image/')){
                    res.status(200).send({message: "Profile image was invalid. User data successfully updated!", imageUploaded: false}).end();
                    return;
                }
                try{
                    let response = await uploadProfileImage(profileImage); ///gives normal azure blob url to us
                    let imageName = response.replace(process.env.AZURE_BLOB_BASE_URL + "/", "").trim(); //extract just the file name of the image so we hide the details of the blob azure storage and sas key                
                    imageSRC = `${process.env.BASE_SERVER_URL}/images/${imageName}`;
                }catch(err){
                    console.log(err);
                }
            }
            if(!imageSRC)
                imageSRC = oldUser.profile_img;

            values = [
              updatedUserInfo.email,
              updatedUserInfo.first_name,
              updatedUserInfo.last_name,
              updatedUserInfo.age,
              updatedUserInfo.height_cm,
              updatedUserInfo.weight_kg,
              imageSRC,
              oldUser.username
            ];
            //first upload the data into the DB
            const response = await queryPromise(updateUserInfoQueryWithImage, values);

            res.status(200).send("Successfully Updated Information").end();
            return;
        }catch(error){
            console.log(error);
            res.status(500).send("Database Error").end();
            return;
        }
    })

    return router;
}

//572946f0-f7f5-4879-b557-5743589e22d81688344077326.jpg