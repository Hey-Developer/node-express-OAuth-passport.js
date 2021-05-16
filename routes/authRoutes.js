const router = require("express").Router();
const passport = require("passport");
const { ensureAuth, ensureGuest } = require("../middlewares/authMiddlewares");

//@ Auth login
router.get("/login", ensureGuest, (req, res) => {
  res.render("login", { user: req.user });
});

//@ Auth Logout
router.get("/logout", ensureAuth, (req, res) => {
  // Handle With Passport
  req.logout();
  res.redirect("/");
});

//@ Auth With Google (HandleWith With Passport)
router.get(
  "/google",
  ensureGuest,
  passport.authenticate("google", {
    scope: ["openid", "profile", "email"],
  })
);

//@ Callback route for Google to redirect (HandleWith With Passport)
router.get(
  "/google/callback",
  ensureGuest,
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;

/* 
? Why we use passport.authenticate() on callback route again as we already used it the /google route ??
 Ohkay so when the user go at /google route passport.authenticate() middleware is fired and the middleware check that this user is not yet accepted the consent form because this request doesn't contain the authorization_code hence this middleware redirect the user to google sign-in page and the consent form. after user allows the consent form we know that the authorization_server respond with a authorization code, and redirect the user to callback URL.

 Now what we do is this code is we again request the authorization_server privately to exchange this code with the access_token so using this access_token client can get access to the resource_server.

 Well We don't have to worry about all this process of sending and exchanging of auth_code with access_token as we are using passport.js
 it will do this work for us.

 let's see how we know the this auth_code is available at the callback URL so what we can do is that 
 At the callback URL we use the passport.authenticate() middleware which will check that if that auth_code is available in the request object then passport will get that auth_code and contact the authorization_server to exchange the code for access_token. when
 passport will get that access_token then this process is success, that is after the successful exchange of auth_code with access_token,
 > verify callback is called which we made during the configuration of our strategy, the passport middleware pass that access_token to the verify callback so that we can use it access the resource from resource_server. and then at the verify callback we call done() function which transfer the control to our next middleware which is the request handler in our callback route. to redirect us to the home page after success login.
 
 Now you understand why we use passport.authenticate() method again on the callback route.
  

*/
