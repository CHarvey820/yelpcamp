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
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1k].city}, ${cities[random1k].state}`,
            title: `${sampleArray(descriptors)} ${sampleArray(places)}`,
            image: `https://source.unsplash.com/random/?camping,${i}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi beatae reiciendis perspiciatis dolor libero ab, quis dolorum porro sed nostrum alias debitis culpa! Consectetur deleniti iure consequatur vitae fugit commodi.',
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

