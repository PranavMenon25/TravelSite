const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware.js");
const userController = require("../controller/users.js");

router.route("/signup")
.get(userController.renderForm)
.post(wrapAsync(userController.newUser));

router.get("/login", userController.renderLogin);
router.get("/logout", userController.logOut)

router.post(
  "/login",
  saveRedirectURL,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.login)
);


module.exports = router;
