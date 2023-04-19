/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
const express = require("express"); // Express web server framework
const request = require("request");
// const axios = require("axios"); // "Request" library
// const bodyParser = require("body-parser");
// const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const jwt = require("jsonwebtoken");
// const https = require("https");
// const exphbs = require("express-handlebars");
const cors = require("cors");
// const { config } = require("./config");
require("dotenv").config();

const client_id = process.env.clientID; // Your client id
const client_secret = process.env.clientSecret; // Your secret
const teamId = process.env.teamId;
const keyId = process.env.keyId;

var redirect_uri = process.env.redirect_uri || "http://localhost:3000/callback"; // Your redirect uri
// var redirect_uri = "http://localhost:3000/callback";
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated stringh
 */
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

var app = express();
// app.engine("handlebars", exphbs({ defaultLayout: null }));
// app.set("view engine", "handlebars");
// app.set("views", __dirname + "/views");
app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = "user-read-private user-read-email user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
