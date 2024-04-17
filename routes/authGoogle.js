const { Router } = require("express");
const router = Router();
const {isUserAuthenticated} = require('../middleware/authCheck')
const SecretStore = require("../secret/SecretStore");

const successLoginUrl = `${SecretStore.GetSecret("BASE_CLIENT_URL")}/google-auth/success`;
const errorLoginUrl = `${SecretStore.GetSecret("BASE_CLIENT_URL")}/google-auth/error`;

module.exports = (passport) =>{
    //a middleware which will redirect us to the auth/google/callback url later on. But prompts a sign in first
    router.get(
      "/login/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );
     //redirected here after authentication process is complete
    router.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        failureMessage: "Cannot Login to Google, please try again later!",
        failureRedirect: errorLoginUrl,
        successRedirect: successLoginUrl,
      }),
      (req, res) => {
        res.send("Thank you for signing in!");
      }
    );

    return router; //so we can actually import the router itself after exporting it in module.exports
}