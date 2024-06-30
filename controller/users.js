const User = require("../models/user.js");

module.exports.newUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    await User.register(newUser, password);
    req.logIn(newUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("Success", "User Registered Successfully");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("Success", "Welcome back to your account");
  if (res.locals.redirectURL) res.redirect(res.locals.redirectURL);
  else res.redirect("/listings");
};

module.exports.logOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }

    req.flash("Success", "You have successfully logged out !");
    res.redirect("/listings");
  });
};
