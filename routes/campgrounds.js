const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('../models/campground');
const campgroundSchema = require('../schemas.js');
const { isLoggedIn } = require('../utils/middleware.js');

const validateCampground = (request, response, next) => {
    const { error } = Campground.validate(request.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

/**
 * All campgrounds
 */
router.get('/', async (request, response) => {
    const campgrounds = await Campground.find({});
    response.render('campgrounds/index', { campgrounds });
})

/**
 * New Campground page
 */
router.get('/new', isLoggedIn, (request, response) => {
    response.render('campgrounds/new');
})


/**
 * POST new campground
 */
router.post('/', isLoggedIn, validateCampground, catchAsync(async (request, response) => {
    const campground = new Campground(request.body.campground);
    await campground.save();
    request.flash('success', 'Successfully made a new campground!');
    response.redirect(`/campgrounds/${campground._id}`);
}))

/**
 * Single Campground
 */
router.get('/:id', catchAsync(async (request, response) => {
    const campground = await Campground.findById(request.params.id).populate('reviews');
    if (!campground) {
        request.flash('error', 'Cannot find campground; it may have been deleted.');
        return response.redirect('/campgrounds');
    }
    response.render('campgrounds/show', { campground });
}))

/**
 * Edit campground
 */
router.get('/:id/edit', isLoggedIn, catchAsync(async (request, response) => {
    const campground = await Campground.findById(request.params.id);
    response.render('campgrounds/edit', { campground });
}))

/**
 * PUT to update edited campground
 */
router.put('/:id', validateCampground, isLoggedIn, catchAsync(async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...request.body.campground });
    request.flash('success', 'Successfully updated campground!');
    response.redirect(`/campgrounds/${campground._id}`);
}))

/**
 * Delete Campground
 */
router.delete('/:id', isLoggedIn, catchAsync(async (request, response) => {
    const { id } = request.params;
    await Campground.findByIdAndDelete(id);
    request.flash('success', 'Successfully deleted campground.');
    response.redirect('/campgrounds');
}))

module.exports = router;