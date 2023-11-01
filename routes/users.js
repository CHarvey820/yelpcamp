const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (request, response) => {
    response.render('users/register');
});

router.post('/register', catchAsync(async (request, response) => {
    try {
        const { email, username, password } = request.body;
        const user = new User({ email, username });
        const registredUser = await User.register(user, password);
        request.flash('success', 'Welcome to Yelp Camp!');
        response.redirect('/campgrounds');
    } catch (e) {
        request.flash('error', e.message);
        response.redirect('register');
    }
}));

module.exports = router;