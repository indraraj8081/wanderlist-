const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapasync');

const { isLoggedIn ,isOwner,validateListing } = require("../middleware");

const listingsController = require('../controllers/listings.js');


router.route('/')
// index route
.get( wrapAsync(listingsController.index))
// create route
.post( isLoggedIn, 
    validateListing,
    wrapAsync(listingsController.createlistings))
;

// new route
router.get('/new', isLoggedIn,(listingsController.renderNewForm));


router.route("/:id")
// show route
.get( wrapAsync(listingsController.showlistings))
// update route
.put(isLoggedIn, isOwner, validateListing, wrapAsync(listingsController.update))
// delete route
.delete(isLoggedIn, isOwner, wrapAsync(listingsController.delete))
;





// edit route
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingsController.renderEditForm));


module.exports = router;