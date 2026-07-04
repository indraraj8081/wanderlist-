const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapasync');

const { isLoggedIn ,isOwner,validateListing } = require("../middleware");

const listingsController = require('../controllers/listings.js');




// index route
router.get('/', wrapAsync(listingsController.index));



// new route
router.get('/new', isLoggedIn,(listingsController.renderNewForm));



// show route
router.get('/:id', wrapAsync(listingsController.showlistings));

// create route
router.post('/', isLoggedIn, validateListing,wrapAsync(listingsController.createlistings));


// edit route
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingsController.renderEditForm));

// update route
router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(listingsController.update));

// delete route
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingsController.delete));

module.exports = router;