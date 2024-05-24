// imports modules & dependencies
const express = require("express");
const env = require("dotenv");
const favicon = require("serve-favicon");
var path = require("path");
var cors = require("cors");
const passport = require("passport");

// imports routes, middleware, and configs
const routes = require("./src/routes");
const { notFoundRoute, errorHandler } = require("./src/configs/errorHandler");

// loads environment variables from .env file
env.config();

// initializes express app
const app = express();

// application database connection establishment
const connectDatabase = require("./src/db/connect");
// const passPort = require("./src/configs/passPort");
connectDatabase();
// corss-origin-allow-all
app.use(cors());

// sets favicon in routes
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// sets static folder
app.use(express.static(path.join(__dirname, "public")));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
require("./src/configs/passport")(passport);
// sets default route
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to App Node.js application backend." });
});

// api routes
app.use("/api", routes);

// 404 - not found error handler
app.use(notFoundRoute);

// error handler
app.use(errorHandler);

const authCtr = require("./src/controllers/authController");
authCtr.defaultAdmin();

// app listens to defined port
app.listen(process.env.APP_PORT, () => {
  console.log(
    `Our Team-App backend server running on:  + ${process.env.APP_PORT}`
  );
});
