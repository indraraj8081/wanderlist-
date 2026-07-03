const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapasync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema} = require('../schema.js');
const { isLoggedIn } = require("../middleware");

const validateListing = (req, res, next) => {
    console.log(req.body);
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};

// index route
router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', {  allListings });
}));

// new route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('listings/new.ejs');
});

// show route
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
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
router.get('/:id/edit',isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));

// update route
router.put('/:id', isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    res.redirect(`/listings/${listing._id}`);
}));

// delete route
router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

module.exports = router;