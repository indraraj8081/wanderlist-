const User = require("../models/user");
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync');
const passport = require("passport");
const { isLoggedIn } = require("../middleware");

router.get("/signup" , (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res) => {
   try {
    let {username,password, email} =req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to wanderlust!");
    res.redirect("/listings");
   } catch(err) {
    req.flash("error", err.message);
    res.redirect("/signup");
   }
    
}));

router.get("/logout", isLoggedIn, (req,res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
});

router.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), (req,res) => {
    req.flash("success", "Welcome back!");
    // const redirectUrl = req.session.returnTo || "/listings";
    // delete req.session.returnTo;
    // res.redirect(redirectUrl);
    res.redirect("/listings");
});
module.exports =router;