/**
 * Main JS app file for YelpCamp application
 * Final Project for Colt Steele - Web Developer Bootcamp 2023
 */

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Joi = require('joi');
const campgroundSchema = require('./schemas.js');
const reviewSchema = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const Review = require("./models/review");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');



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
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
/*app.use(express.static(path.join(__dirname,'public')));
*/

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((request, response, next) => {
    response.locals.currentUser = request.user;
    response.locals.success = request.flash('success');
    response.locals.error = request.flash('error');
    next();
})

/**
 * Include Router components
 */
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

/**
 * Initialize basic route
 */
app.get('/', (request, response) => {
    response.render('home');
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.all('*', (request, response, next) => {
    next(new ExpressError('Page Not Found', 404));
})

/**
 * Action for catchAsync when an error occurs
 */
app.use((error, request, response, next) => {
    const { statusCode = 500 } = error;
    if (!error.message) error.message = 'An Error has Occurred';
    response.status(statusCode).render('error', { error });

})

app.listen(3000, () => {
    console.log('Running on port 3000');
})