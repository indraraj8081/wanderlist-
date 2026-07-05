const Listing = require('../models/listing.js');

// index route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// new route
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
}

// show route
module.exports.showlistings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing you request for does not exist");
        return res.redirect("/listings");
    }
    res.render('listings/show.ejs', { listing });
};

// create route
module.exports.createlistings = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url: url, filename: filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings`);
};

// edit route

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
};

// update route
module.exports.update = async (req, res) => {
    
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

// delete route

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to delete this listing.");
        return res.redirect('/listings');
    }
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
};
