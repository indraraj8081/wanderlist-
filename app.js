const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const path = require('path');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');


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


app.get('/', (req, res) => {
    res.send('server is running');
});

app.get('/listings', async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', {  allListings });
});

// new route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

// show route
app.get('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
});


app.post('/listings', async (req, res) => {
    // let ({ title, description, price, location, image } = req.body);
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect(`/listings/${newlisting._id}`);  
});

// edit route

app.get('/listings/:id/edit', async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
});

// update route
app.put('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    res.redirect(`/listings/${listing._id}`);
});

// delete route
app.delete('/listings/:id', async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

app.listen(8080, () => {
    console.log(`Server is running on port 8080`);
});

