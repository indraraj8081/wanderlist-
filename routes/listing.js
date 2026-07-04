const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapasync');

const { isLoggedIn ,isOwner,validateListing } = require("../middleware");




// index route
router.get('/', wrapAsync());

// new route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('listings/new.ejs');
});

// show route
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing you request for does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render('listings/show.ejs', { listing });

}));

// create route
router.post('/', isLoggedIn, (req, res, next) => {
    console.log(req.body);
    next();
}, validateListing, wrapAsync(async (req, res, next) => {
    try{
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    console.log(req.user);
    newListing.owner = req.user._id; // Set the owner of the listing to the currently logged-in
    await newListing.save();
    console.log("saved Successfully");
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings`);
    }
    catch (err){
        console.log(err);
    }
}));


// edit route
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));

// update route
router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}));

// delete route
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to delete this listing.");
        return res.redirect('/listings');
    }
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

module.exports = router;