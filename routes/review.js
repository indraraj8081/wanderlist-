const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapasync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema} = require('../schema');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const {validateReview} = require("../middleware");

const reviewControllers = require('../controllers/reviews.js');

// review route
// post route
router.post("/" ,validateReview,wrapAsync(reviewControllers.createReview));



// delete review route

router.post("/:reviewId",
    wrapAsync(reviewControllers.destroyReview));

module.exports = router;