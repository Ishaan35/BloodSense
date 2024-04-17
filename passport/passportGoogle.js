const GoogleStrategy = require('passport-google-oauth2').Strategy
const {queryPromise} = require('../utils/queryUtils')
const SecretStore = require("../secret/SecretStore");
const CALLBACK_URL = `${SecretStore.GetSecret("BASE_SERVER_URL")}/auth/google/callback`;

module.exports = function(passport) {
    
    passport.use(
      new GoogleStrategy({
        clientID: SecretStore.GetSecret("GOOGLE_AUTH_CLIENT_ID"),
        clientSecret: SecretStore.GetSecret("GOOGLE_AUTH_CLIENT_SECRET"),
        callbackURL: CALLBACK_URL,
        passReqToCallback: true
      }, async function verify(req, accessToken, refreshToken, profile, doneCb){

        const user = {
            username: profile.email,
            email: profile.email,
            id: profile.id,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            profile_img: null
        }
        const existingUsersQuery = `SELECT * FROM users WHERE id = $1`;

        try{
            const existingUsers = await queryPromise(existingUsersQuery, [user.id]);
            if(existingUsers.length > 0){
                return doneCb(null, existingUsers[0]); //just return the user object when we invoke the callback as we are technically logging in
            }
            else{ //signing up instead. Create account here!!
                try{
                    const addUserQuery = `INSERT INTO users (id, username, email, "isGoogle", first_name, last_name, profile_img) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
                    await queryPromise(addUserQuery, [user.id, user.username, user.email, 1, user.first_name, user.last_name, user.profile_img]);
                    await queryPromise(
                      `INSERT INTO custom_biomarkers (user_id, custom_biomarker_list) VALUES ($1,$2)`,
                      [user.id, JSON.stringify([])]
                    );
                    return doneCb(null, user); //null error, and user object
                }catch(err){
                    console.log(err);
                    return doneCb(err, null); //error and null user
                }
            }
        }catch(err){
            console.log(err);
            return doneCb(err, null);
        }

      })
    );


    passport.serializeUser((user, doneCb) =>{
        doneCb(null, {id: user.id, username: user.username, isGoogle: true})
    })

    passport.deserializeUser(async (user, doneCb) =>{
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
    })

}