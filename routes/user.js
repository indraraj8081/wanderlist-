const User = require("../models/user");
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync');
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const { saveRedirectUrl } = require("../middleware");

const userControllers = require('../controllers/users.js');

router.route("/signup")
// signup render route
.get(userControllers.renderSignupForm)
// signup route
.post( wrapAsync(userControllers.signup));

router.route("/login")
// login render route
.get(userControllers.renderLoginForm)
// login route
.post(saveRedirectUrl, passport.authenticate("local", 
    {failureFlash: true, 
        failureRedirect: "/login"}), userControllers.login);

// login route
router.get("/logout", isLoggedIn, userControllers.logout);


module.exports =router;