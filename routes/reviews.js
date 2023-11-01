const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewSchema = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('../models/campground');
const Review = require("../models/review");

const validateReview = (request, response, next) => {

    const { error } = Review.validate(request.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

/**
 * POST new Review 
 */
router.post('/', validateReview, catchAsync(async (request, response) => {
    const campground = await Campground.findById(request.params.id);
    const review = new Review(request.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    request.flash('success', 'Successfully added review!');
    response.redirect(`/campgrounds/${campground._id}`);
}))

/**
 * Delete Campground Review
 */
router.delete('/:reviewId', catchAsync(async (request, response) => {
    const { id, reviewId } = request.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(request.params.reviewId);
    request.flash('success', 'Successfully deleted review.');
    response.redirect(`/campgrounds/${id}`);
}))

module.exports = router;