const wrapAsync = require("./utils/wrapAsync");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;
    req.flash("error", "You must be logged in ");
    return res.redirect("/login");
  }

  else{
    next();
  }
};

module.exports.saveRedirectURL = (req, res, next) => {
  if(req.session.redirectURL){
    res.locals.redirectURL = req.session.redirectURL;
  }

  next();
}

module.exports.isOwner = wrapAsync(async(req, res, next) =>{
  let {id} = req.params;
  let requestUser = await Listing.findById(id);
  if(!requestUser.owner.equals(req.user._id)){
    req.flash("error", "You don't have access");
    res.redirect("/listings");
  }
  else{
    next();
  }
});

module.exports.isAuthor = wrapAsync(async(req, res, next) =>{
  let {reviewID} = req.params;
  let   requestUser = await Review.findById(reviewID);
  if(!requestUser.author.equals(req.user._id)){
    req.flash("error", "You don't have access");
    res.redirect("/listings");
  }
  else{
    next();
  }
});

module.exports.validateReview = (req, res, next) => {
  let { error } = Review.validate(req.body);
  if (error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

module.exports.validate = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};