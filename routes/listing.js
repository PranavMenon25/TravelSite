const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const {storage} = require("../CloudConfig.js");
const upload = multer({storage})
const { isLoggedIn, isOwner, validate } = require("../middleware.js");
const listingController = require("../controller/listing.js");

router.route("/")
.get(listingController.index)
.post(isLoggedIn, upload.single('listing[image]'), validate, wrapAsync(listingController.newList));

router.get("/new", isLoggedIn, listingController.newPage);
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editPage));


router.route("/:id")
.get(wrapAsync(listingController.showPage))
.put(isOwner, upload.single('listing[image]'), isLoggedIn, wrapAsync(listingController.UpdatePage))
.delete(isLoggedIn, wrapAsync(listingController.delete));



module.exports = router;
