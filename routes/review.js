const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { isLoggedIn, isAuthor, validateReview} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");


router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.ReviewPost));
router.delete("/:reviewID", isLoggedIn, isAuthor, wrapAsync(reviewController.DeleteReview));

module.exports = router;
