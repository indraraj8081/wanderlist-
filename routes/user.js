const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync');

router.get("/signup" , (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res) => {
   try {
    let {username,password, email} =req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to welcome wnadurlust!");
    req.redirect("/listings");
   } catch(err) {
    req.flash("error", err.message);
    req.redirect("/signup");
   }
    
}));

module.exports =router;