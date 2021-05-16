module.exports.ensureAuth = (req, res, next) => {
  // Now to check auth there are two ways..
  // ? Way-1 is to check via req.user
  // ? Way-2 is to check via user.isAuthenticated()

  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

module.exports.ensureGuest = (req, res, next) => {
  // this middleware will be used to check if user logged in and then try to access the login paths then it is not allowed
  if (req.isAuthenticated()) {
    res.redirect("/profile");
  } else {
    next();
  }
};
