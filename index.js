var saml2 = require("saml2-js");
var fs = require("fs");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Create service provider
const sp_client_id = "ingee-saml-client";
const sp_host = "localhost";
const sp_port = 3000;
const sp_url = "http://" + sp_host + ":" + sp_port;
console.log("sp_url=", sp_url);

var sp_options = {
  entity_id: sp_url + "/metadata.xml",
  private_key: fs.readFileSync("key-priv.pem").toString(),
  certificate: fs.readFileSync("key-cert.crt").toString(),
  assert_endpoint: sp_url + "/assert"
};
var sp = new saml2.ServiceProvider(sp_options);

// Create identity provider
var idp_options = {
  sso_login_url: "https://dev-console.myinitial.io/kc/auth/realms/vc-authn/protocol/saml",
  sso_logout_url: "https://dev-console.myinitial.io/kc/auth/realms/vc-authn/protocol/saml",
  certificates: "MIICnzCCAYcCBgF8l5ExtzANBgkqhkiG9w0BAQsFADATMREwDwYDVQQDDAh2Yy1hdXRobjAeFw0yMTEwMTkwNzU5MDdaFw0zMTEwMTkwODAwNDdaMBMxETAPBgNVBAMMCHZjLWF1dGhuMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiXtSovLaFn0+6M8qDvNunj6v2gHDxy+3upfU8hULDUY597v9q5bLH6OBTZ9nKlayf6b4sURaq3/TNPybUwYgp1SrlWlYGFG0bFvlSCpp2zf5+zqtLyOe+NaLb4wzEIdwTJ5Wyutza/hDWf0/pAy1tHi586dgGwOymomhDvY9zY8/IuA7qNoGDf0I7NJATXtsB9K+e0YRfUuuwu0P2I2F8CfAQyW1b5D511x+bPWEN9nq0W3p3nLDipILCDPp7G7NhuLBsquExnB/4hTBLs9F61Zmuq/yyPh4RR9BHycrfXm3kEcYUR2evHPI5fGfemwuxIfZc36i4hmT6NrOHy6f6QIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQBfpsO5r4jTsNcY9zOhVXg6/111FthmZHEYbw0HPW+tyqg6OkcreYCQphnsB2H1Hc2/0NRCuMYXPl+y1l+jcvXHlMXl7DVuwQaWfv8mLgnH8L/EQHw96OhIzE5Wz8mjthvWx36RWBlC88CRn2/mY5QEx2mDGEkdNPXvi74aM4DsaNH+tE9wrEoemhEKml1Pm77MzL2iS6J4Xg0GSYkzTRN50jnIcXyHqIW5Y5ftvpFX3J8F53dZZEJOEUADkCfJGW4BflmsKt3H/BFKM0DHoeOtiq8QfmO9QiWJlefSmPW7MaBwx4g2y1anzQ1EwvPb1MRTBc0l8VRiFFmOqiBUe1aj"
};
var idp = new saml2.IdentityProvider(idp_options);

// ------ Define express endpoints ------

// Endpoint to retrieve metadata
app.get("/metadata.xml", function(req, res) {
  console.log("/metadata.xml called");
  res.type("application/xml");
  res.send(sp.create_metadata());
});

// Starting point for login
app.get("/login", function(req, res) {
  console.log("/login called");
  sp.create_login_request_url(idp, {}, function(err, login_url, request_id) {
    if (err != null)
      return res.send(500);
    res.redirect(login_url);
    console.log("  - err=", err);
    console.log("  - login_url=", login_url);
    console.log("  - request_id=", request_id);
  });
});

// Assert endpoint for when login completes
app.post("/assert", function(req, res) {
  console.log("/assert called");
  var options = {request_body: req.body};
  sp.post_assert(idp, options, function(err, saml_response) {
    if (err != null)
      return res.send(500);

    // Save name_id and session_index for logout
    // Note:  In practice these should be saved in the user session, not globally.
    name_id = saml_response.user.name_id;
    session_index = saml_response.user.session_index;

    res.send("Hello #{saml_response.user.name_id}!");
  });
});

// Starting point for logout
app.get("/logout", function(req, res) {
  console.log("/logout called");
  var options = {
    name_id: name_id,
    session_index: session_index
  };

  sp.create_logout_request_url(idp, options, function(err, logout_url) {
    if (err != null)
      return res.send(500);
    res.redirect(logout_url);
  });
});

app.listen(3000);
console.log("listening", sp_url);
console.log("endpoints:", "/metadata.xml", "/login", "/assert", "/logout");
