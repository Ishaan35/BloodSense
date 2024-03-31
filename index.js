//Server hosted on Render.com

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const expressSession = require("express-session");

const MySQLStore = require("express-mysql-session")(expressSession); //mysql store
const PgSession = require('connect-pg-simple')(expressSession) //postgres store

const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const db = require("./db/postgresDb"); // Import mysql connection pool
const {wait} = require('./utils/fileUploadUtils')


app.set("trust proxy", 1);
app.enable("trust proxy");

/*
// Configure express-mysql-session
const sessionStore = new MySQLStore(
  {
    createDatabaseTable: true, // Create the sessions table if it doesn't exist
    expiration: parseInt(process.env.MAX_COOKIE_AGE_MILLIS), // Set the session expiration time in milliseconds
  },
  db
);
*/

const sessionStore = new PgSession({
  pool:db,
  tableName: 'session',
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET_COOKIE_SESSION_KEY));


let inProduction = true;
if(process.env.IN_PRODUCTION && process.env.IN_PRODUCTION === "false")
  inProduction = false;

  app.set("trust proxy", 1);

app.use(
  expressSession({
    secret: process.env.SECRET_COOKIE_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: inProduction,
      sameSite: inProduction ? "none" : "Lax",
      path: "/", // Set the path to '/',
      domain: inProduction ? ".bloodsense.online" : "localhost",
      maxAge: parseInt(process.env.MAX_COOKIE_AGE_MILLIS),
    },
    store: sessionStore, // Use the express-mysql-session store for session storage
  })
);

app.use(
  cors({
    origin: process.env.BASE_CLIENT_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    exposedHeaders: ["X-Custom-Header", "Set-Cookie"],
    credentials: true,
    preflightContinue: true,
  })
);

app.use(passport.initialize()); //
app.use(passport.session()); //configures passport session management (relies on express session, so must be applied after)

//configure passport to use both of our strategies
require("./passport/passportConfig")(passport);
require("./passport/passportGoogle")(passport);

const authRouter = require("./routes/auth");
const googleAuthRouter = require("./routes/authGoogle");
const profileChangesRouter = require("./routes/profileChanges");
const getImageRouter = require("./routes/getImage");
const getFileRouter = require("./routes/getDocument");
const createRecordsRouter = require("./routes/creatingRecords");
const uploadDocumentRouter = require("./routes/uploadingDocuments");
const analysisDataRouter = require("./routes/analysisData");
const dashboardDataRouter = require("./routes/dashboardData");


app.get("/", (req, res) => {
  db.query("SELECT NOW()", (err, result) => {
    if (err) {
      const errorResponse = {
        message: `${process.env.TESTVAR} Error connecting to the database: ${err.message}`,
        error: err,
      };
      return res.status(500).json(errorResponse);
    }
    res.send(`Whats Up? DB seems to be working fine  ${process.env.TESTVAR}`);
  });
});


app.get("/ping", async (req, res) =>{
  if(!req.user){
    res.status(401).send("Unauthenticated");
  }
  else{
    res.status(200).send("Authenticated")
  }
})

//routers
app.use("/", authRouter(passport)); //send the same passport instance
app.use("/", googleAuthRouter(passport));
app.use("/", profileChangesRouter(passport));
app.use("/", getImageRouter(passport));
app.use("/", getFileRouter(passport));
app.use("/", uploadDocumentRouter(passport));
app.use("/", createRecordsRouter(passport));
app.use("/", analysisDataRouter(passport));
app.use("/", dashboardDataRouter(passport));

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is up and running!`);
});
