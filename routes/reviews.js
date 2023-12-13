const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utils/middleware.js');
const Review = require("../models/review");

/**
 * POST new Review 
 */
router.post('/', isLoggedIn, validateReview, catchAsync(async (request, response) => {
    const campground = await Campground.findById(request.params.id);
    const review = new Review(request.body.review);
    review.author = request.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    request.flash('success', 'Successfully added review!');
    response.redirect(`/campgrounds/${campground._id}`);
}))

/**
 * Delete Campground Review
 */
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (request, response) => {
    const { id, reviewId } = request.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(request.params.reviewId);
    request.flash('success', 'Successfully deleted review.');
    response.redirect(`/campgrounds/${id}`);
}))

module.exports = router;