const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const methodOverride = require('method-override');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../utils/middleware.js');

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
    campground.author = request.user._id;
    await campground.save();
    request.flash('success', 'Successfully made a new campground!');
    response.redirect(`/campgrounds/${campground._id}`);
}))

/**
 * Show Single Campground
 */
router.get('/:id', catchAsync(async (request, response) => {
    const campground = await Campground.findById(request.params.id).populate({path:'reviews', populate: { path: 'author'}}).populate('author');
    if (!campground) {
        request.flash('error', 'Cannot find campground; it may have been deleted.');
        return response.redirect('/campgrounds');
    }
    response.render('campgrounds/show', { campground });
}))

/**
 * Edit campground
 */
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (request, response) => {
    const campground = await Campground.findById(request.params.id);
    response.render('campgrounds/edit', { campground });
}))

/**
 * PUT to update edited campground
 */
router.put('/:id', validateCampground, isLoggedIn, isAuthor, catchAsync(async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...request.body.campground });
    request.flash('success', 'Successfully updated campground!');
    response.redirect(`/campgrounds/${campground._id}`);
}))

/**
 * Delete Campground
 */
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (request, response) => {
    const { id } = request.params;
    await Campground.findByIdAndDelete(id);
    request.flash('success', 'Successfully deleted campground.');
    response.redirect('/campgrounds');
}))

module.exports = router;