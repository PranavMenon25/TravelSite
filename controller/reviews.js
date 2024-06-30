const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.ReviewPost = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  console.log("Review Saved");
  req.flash("Success", "Review Added");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.DeleteReview = async (req, res) => {
  let { id, reviewID } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
  await Review.findByIdAndDelete(reviewID);
  req.flash("Success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
