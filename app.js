const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapasync');
const ExpressError = require('./utils/ExpressError');
const { listingSchema ,reviewSchema} = require('./schema');
const Review = require('./models/review.js');


const PORT = 8080;

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));


// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
// joi ko function ke form me convert karne ke liye hum ek middleware function bana sakte hain jo request body ko validate karega aur agar validation fail hota hai to error throw karega. Aapka `validateListing` function is kaam ke liye sahi hai. 
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};


app.get('/', (req, res) => {
    res.send('server is running');
});

app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', {  allListings });
}));

// new route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

// show route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render('listings/show.ejs', { listing });
}));

// create route
app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings`);
}));


// edit route
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));

// update route
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
    
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    res.redirect(`/listings/${listing._id}`);
}));

// delete route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

// review route
// post route
app.post('/listings/:id/reviews',validateReview,wrapAsync (async(req,res,)=>{
    let listing =await Listing.findById(req.params.id);
    let newReview =new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();


    res.redirect(`/listings/${listing._id}`);

}));

app.all("/{splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong!" } = err;
    res.status(statusCode).render('error.ejs', {message, err, });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log(`Server is running on port 8080`); 
});

