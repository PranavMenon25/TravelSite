const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
  let listings = await Listing.find({});
  res.render("listing2/index.ejs", { listings });
};

module.exports.newPage = (req, res) => {
  res.render("listing2/new.ejs");
};

module.exports.showPage = async (req, res) => {
  let { id } = req.params;
  let found = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!found) {
    req.flash("error", "Listing You requested for does not exist");
    res.redirect("/listings");
  } else res.render("listing2/show.ejs", { found });
};

module.exports.editPage = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing2/edit.ejs", { listing });
};

module.exports.UpdatePage = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof(req.file) != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    listing.image = {url, filename};  
  }
  listing.save();
  req.flash("Success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("Success", "Listing Deleted Successfully");
  res.redirect("/listings");
};

module.exports.newList = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename
  console.log(url, "..", filename);
  let listing = req.body.listing;
  let tempSave = new Listing(listing);
  tempSave.image = {url, filename};
  tempSave.owner = req.user._id;
  await tempSave.save(); // This is an asynchronous function so we must await it
  req.flash("Success", "Listing Added Successfully");
  res.redirect("/listings");
};
