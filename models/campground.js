/**
 * Campground object
 */

/**
 * Initialize Mongoose for MongoDB
 */
const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review');
const Schema = mongoose.Schema;

/**
 * CampgroundSchema Schema
 *      Represents Schema for Campground objects
 */
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

});

/**
 * Delete all reviews from Campground & database when Campground is deleted
 */
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema);