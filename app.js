/**
 * Main JS app file for YelpCamp application
 * Final Project for Colt Steele - Web Developer Bootcamp 2023
 */

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

/**
 * Mongoose setup
 */
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const database = mongoose.connection;
database.on("error", console.error.bind(console, "connection error:"));
database.once("open", () => {
    console.log("Database connected");
});

/**
 * ejs setup
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

/**
 * Initialize basic route
 */
app.get('/', (request, response) => {
    response.render('home');
})

/**
 * All campgrounds
 */
app.get('/campgrounds', async (request, response) => {
    const campgrounds = await Campground.find({});
    response.render('campgrounds/index', { campgrounds });
})

/**
 * New Campground page
 */
app.get('/campgrounds/new', (request, response) => {
    response.render('campgrounds/new');
})

/**
 * POST new campground
 */
app.post('/campgrounds', async (request, response) => {
    const campground = new Campground(request.body.campground);
    await campground.save();
    response.redirect(`/campgrounds/${campground._id}`);
})

/**
 * Single Campground
 */
app.get('/campgrounds/:id', async (request, response) => {
    const campground = await Campground.findById(request.params.id);
    response.render('campgrounds/show', { campground });
})

/**
 * Edit campground
 */
app.get('/campgrounds/:id/edit', async (request, response) => {
    const campground = await Campground.findById(request.params.id);
    response.render('campgrounds/edit', { campground });
})

/**
 * PUT to update edited campground
 */
app.put('/campgrounds/:id', async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...request.body.campground });
    response.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id', async (request, response) => {
    const { id } = request.params;
    await Campground.findByIdAndDelete(id);
    response.redirect('/campgrounds');
})


app.listen(3000, () => {
    console.log('Running on port 3000');
})