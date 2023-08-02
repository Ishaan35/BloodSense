const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const { uuid } = require("uuidv4");
const {queryPromise} = require('../utils/queryUtils')
require('dotenv').config();
const {isUserAuthenticated} = require('../middleware/authCheck')

module.exports = (passport) => {

  //THIS ROUTE WORKS GOOD. 
  router.post("/register", async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const first_name = req.body.first_name;

    //Something went wrong in the request body. 
    if (!username || !password || !first_name) {
      res.status(401).send("Username or password undefined");
      res.end();
      return;
    }

    const addUserQuery = `INSERT INTO ${process.env.DB_NAME}.users (id, username, password, first_name) VALUES (?,?,?,?)`;
    const findUsersQuery = `SELECT * FROM ${process.env.DB_NAME}.users WHERE username = ?`;
    
    //we check for existing users with same username. if there are, or if there was an error, immediately end and handle the error
    try{
      const existingUsers = await queryPromise(findUsersQuery, [username]);
      if(existingUsers.length > 0 || existingUsers.length !== 0){
        res.status(409).send("Username already exists");
        res.end();
        return;
      }
    }catch(err){
      res.status(500).send("Database Lookup Error");
      res.end();
      return;
    }

    //now we try to add the user. If there is an error, we handle the error and return out of the function
    const hashedPassword = bcrypt.hashSync(password, 10);
    try{
      let id = uuid();
      await queryPromise(addUserQuery, [id, username, hashedPassword, first_name]);
      await queryPromise(`INSERT INTO ${process.env.DB_NAME}.custom_biomarkers (user_id, custom_biomarker_list) VALUES (?,?)`, [id, JSON.stringify([])]);
    }
    catch(err){
      res.status(500).send("Database insertion error");
      res.end();
      return;
    }

    //we await for passport to authenticate. If authenticated, return the user. If there was an error, the catch block will handle the error and return
    let user = null;
    try{
      user = await new Promise((resolve, reject) =>{
        passport.authenticate('local', (err, user, info) =>{
          if(err) reject(err);
          resolve(user);
        })(req, res);
      })
    }
    catch(err){
      console.log(err);
      res.status(500).send("authentication error. User has been created. Please login again!")
      res.end();
      return;
    }

    //now we log the user in and make a valid session and cookie for the user. 
    //First of all, if no user was returned from authentication above, then we immediately end and handle the error
    //otherwise just send the response after login callback
    if(!user){
      console.log(err);
      res.status(401).send("user authentication failed. User had been created. Please login again!")
      res.end();
      return;
    }
    else{
      req.login(user, (err) =>{
        if(err){
          res.status(401).send("user login failed. User had been created. Please login again!")
          res.end();
        }
        else{
          res.status(200).send({ success: true, message: "User created and logged in!" });
        }
      })    
    }
  });

  //only if valid session key cookie
  router.get("/getUser", (req, res) => {
    //console.lg(req.user);
    if(!req.user){
      res.send(null);
    }
    else{
      let user = { ...req.user };
      delete user.id;
      res.send(user);
    }

  });

  router.post("/login", (req, res, next) => {
    const middlewareFunc = passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (!user) res.status(401).send(`Username or password is incorrect`);


      if (user) {
        req.login(user, (err) => {
          if (err) throw err;

          //this response is sent
          res.status(200).send({
            success: true,
            message: "User Logged In Successfully",
          });
        });
      }
    });
    middlewareFunc(req, res, next);
  });

  router.post("/logout", (req, res, next) => {

    //this invalidates the session associated with this user. The cookie on the client side is not cleared, but the session is cleared so the cookie is invalid now.
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).send("Logged out");
      res.end();
    });
  });

  return router; //so the router is also exported
};


//this is a utility function allowing us to use async/await with mysql db queries
//basically the db query callback resolves the promise, but until then, the promise is in an unsettled state
//while the promise is in an unsettled state, await will not be happy, so it will make sure this promise is settled before it continues code execution
//we can use the function like this: const result = await queryPromise(query, [val1, val2, ...]);
