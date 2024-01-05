const Campground = require('../models/campground');

/** Controller file for campgrounds methods */

/** render campgrounds index */
module.exports.index = async (request, response) => {
    const campgrounds = await Campground.find({});
    response.render('campgrounds/index', { campgrounds });
}

/** render new campground form */
module.exports.renderNewForm = (request, response) => {
    response.render('campgrounds/new');
}

/** create a new campground in DB */
module.exports.createCampground = async (request, response) => {
    const campground = new Campground(request.body.campground);
    campground.author = request.user._id;
    await campground.save();
    request.flash('success', 'Successfully made a new campground!');
    response.redirect(`/campgrounds/${campground._id}`);
}

/** show campground page */
module.exports.showCampground = async (request, response) => {
    const campground = await Campground.findById(request.params.id).populate({path:'reviews', populate: { path: 'author'}}).populate('author');
    if (!campground) {
        request.flash('error', 'Cannot find campground; it may have been deleted.');
        return response.redirect('/campgrounds');
    }
    response.render('campgrounds/show', { campground });
}

/** render edit campground form */
module.exports.renderEditForm = async (request, response) => {
    const campground = await Campground.findById(request.params.id);
    response.render('campgrounds/edit', { campground });
}

/** update campground in DB */
module.exports.updateCampground = async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...request.body.campground });
    request.flash('success', 'Successfully updated campground!');
    response.redirect(`/campgrounds/${campground._id}`);
}

/** delete campground from DB */
module.exports.deleteCampground = async (request, response) => {
    const { id } = request.params;
    await Campground.findByIdAndDelete(id);
    request.flash('success', 'Successfully deleted campground.');
    response.redirect('/campgrounds');
}