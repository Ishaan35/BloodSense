const db = require('../db/postgresDb')
const bcrypt = require('bcrypt')
const localStrategy = require('passport-local').Strategy;
const {queryPromise} = require('../utils/queryUtils')

module.exports = (passport) =>{
    passport.use(
      new localStrategy(
        {
          usernameField: "username", // Specify the field name for email
          passwordField: "password", // Specify the field name for password. these are useful as when the req object is given to the passport.authenticate method, it will look for these fields in the req.body. If you ever decide to nest these fields inside of another object, just put "objectname.username" and "objectname.password" instead
        },
        function verify(username, password, doneCb) { //this verify function is for logging in! The register route takes care of creating account in DB
          const query =
            `SELECT * FROM users WHERE username = $1`;
          db.query(query, [username], (err, result) => {
            if (err) throw err;
            if (result.rows.length == 0){
              return doneCb(null, false, {
                message: "Username or password is incorrect",
              });
            }
            if (result.rows[0].isGoogle == 1 || result.rows[0].isGoogle == true){
              return doneCb(null, false, {
                message: "Username or password is incorrect",
              });
            }
            //otherwise all good
            bcrypt.compare(
              password,
              result.rows[0].password,
              (error, response) => {
                if (error) throw error;
                if (response == true) return doneCb(null, result.rows[0]);
                return doneCb(null, false, {
                  message: "Username or password is incorrect",
                }); //password did not match
              }
            );
          });
        }
      )
    );

    passport.serializeUser((user, doneCb) => {
      doneCb(null, { id: user.id}); //want to store the user id and username in the session
    });

    passport.deserializeUser(async (user, doneCb) => {
      //adds req.user to the req object in requests
      const findUsersQuery = `SELECT * FROM users WHERE id = $1`;

      let result = null;
      try{
        result = await queryPromise(findUsersQuery, [user.id]);
      }catch(err){
        console.log(err);
        return doneCb(err, null);
      }
      result = result[0];
    
      delete result.password;

      return doneCb(null, result); //the deserialized user will then be available
    });
}