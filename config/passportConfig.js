const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/Users");

//@ Step-1:
passport.use(
  new GoogleStrategy(
    {
      //options for the google strategy
      //here we will give the our credentials so that our app can easily communicate with the google+ api
      // To get the credentials, login to console.developers.google.com create a new project there and then under API section add Google+ API.
      // Now click on create credentials and create Oauth client id.
      // you will get a client id and client secret as credentials.
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      //passport callback function
      //- The accessToken is used to access resources from the resource_server, but we don't need it right now as our purpose is just authentication and not authorization
      //+ The refreshToken is used to refresh the accessToken as it expires after a certain time.
      //- remember our purpose is authentication and hence under the hood and OPEN_ID flow is going on hence in the auth_server in response send us two thing one is the accessToken and the other one is the user profile which we use to store the user detail in our db.
      //+ done here is act as next() function i.e to transfer the flow to the next middleware, it is mandatory to call this otherwise the request will stuck and not transfer to the callback URL request handler where we redirect our user to home page.
      //- done() here first you will provide null if there is no error and the second param is the user detail you want to pass to the view.
      // here we save the user in our database.
      const user = await User.findOrCreate(profile.id, profile.emails[0].value);
      if (user.error) {
        return done(user.error, user);
      }
      return done(null, user);
    }
  )
);

//@ Step-2: Now the next step is to add passport middlewares(initialize and session) in our express APP.

//@ Step-3 is to call passport.authenticate("google") method as middleware at the route where u want to enable google sign-in feature.

//@ Step-4 If you are using session then u must use serializeUser and deserializeUser.
passport.serializeUser((user, done) => {
  done(null, user._id);
  // Here the id from the user is grab and then store it in a cookie and then send it the browser. by attaching it with the response object i.e under the hood something like this.. res.cookie("id","713t423t48c");
});

passport.deserializeUser((id, done) => {
  // what does this function is that it grab the cookie-->decode it and give us user id
  // now we have to search for user with that id in our database
  // and then return that user.
  // so that passport will attach that user in req object so that we can access it in further request handlers.
  // like req.user
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//note: the encoding of id before storing it cookie and sent the browser is done by extra package like express-session or cookie-session which is then by used by passport to do so.
