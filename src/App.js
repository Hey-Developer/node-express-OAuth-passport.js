require("dotenv").config();
const express = require("express");
const path = require("path");
const authRoutes = require("../routes/authRoutes");
const passport = require("passport");
const session = require("express-session");
const { ensureGuest } = require("../middlewares/authMiddlewares");
const profileRoutes = require("../routes/profileRoutes");

//@ Load Passport Config:
require("../config/passportConfig");

//@ Start Database Connection:
const db = require("../config/dbConfig");

//@ App Initialization:
const app = express();

//@ constants Variables:
const port = process.env.PORT || 8000;
const views_path = path.join(__dirname, "../views");
const public_path = path.join(__dirname, "../public");

//@ App Configuration:
app.set("views", views_path);
app.set("view engine", "ejs");

//@ Middleware to set the static path:
app.use(express.static(public_path));

//@ express-session:
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

//@ Middleware for Passport.js
app.use(passport.initialize());
app.use(passport.session());

//@ Middleware for handling auth routes
app.use("/auth", authRoutes);

//@ Profile routes
app.use("/profile", profileRoutes);

//@ Routes:
app.get("/", ensureGuest, (req, res) => res.render("home", { user: req.user }));

//@ Listening to the Server:
app.listen(port, () =>
  console.log(
    `Node App is listening on http://localhost:${port} Please Wait for the Database connection to establish`
  )
);
