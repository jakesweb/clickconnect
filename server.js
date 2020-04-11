require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const AccessToken = require("twilio").jwt.AccessToken;

const VideoGrant = AccessToken.VideoGrant;
const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issure: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithm: ["RS256"],
});

app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated",
  });
});

app.get("/api/token", checkJwt, (req, res) => {
  var identity = "Bearer";
  var token = new AccessToken(
    process.env.TWILIO_ACCT_SID,
    process.env.TWILIO_SID,
    process.env.TWILIO_API_KEY
  );

  token.idenity = identity;

  const grant = new VideoGrant();
  token.addGrant(grant);

  res.send({
    identity: identity,
    token: token.toJwt(),
  });
});

//start the app
app.listen(3001, () => console.log("API listening on 3001"));
