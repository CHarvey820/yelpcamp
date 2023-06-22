/**
 * Campground object
 */

/**
 * Initialize Mongoose for MongoDB
 */
const mongoose = require('mongoose');
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
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);