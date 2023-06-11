const express = require('express');
const app = express();
const path = require('path');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const mongoose = require('mongoose');
const Campground = require('../models/campground');

/**
 * Mongoose setup
 */
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const database = mongoose.connection;
database.on("error", console.error.bind(console, "connection error:"));
database.once("open", () => {
    console.log("Database connected");
});

const sampleArray = array => array[Math.floor(Math.random() * array.length)];

/**
 * Seed DB with random Campgrounds from seed data
 */
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1k = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1k].city}, ${cities[random1k].state}`,
            title: `${sampleArray(descriptors)} ${sampleArray(places)}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
