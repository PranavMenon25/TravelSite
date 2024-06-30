if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
  console.log(process.env.SECRET);
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require('connect-mongo');


const uri = process.env.MAP_TOKEN;

const reviewRouter = require("./routes/review.js")
const listingsRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store =   MongoStore.create({
  mongoUrl: uri,
  crypto:{
    secret: process.env.Secret1,
  },
  touchAfter: 24 * 3600
});

store.on("error", ()=>{
  console.log("Error in mongo session store");
})

const sessionOptions = {
  store: store,
  secret: process.env.Secret1,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next)=>{
  res.locals.Success = req.flash("Success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})

console.log(Listing);

app.listen("8080", () => {
  console.log("Server is listening to port");
});


main()
  .then(() => {
    console.log("Data Base connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(uri);
}

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use("*", (req, res, next) => {
  // console.log("Not found Page");
  let error = new ExpressError(404, "Page Not Found");
  next(error);
});

app.use((err, req, res, next) => {
  let { status=500, message ="Something Went Wrong"} = err;
  res.render("error.ejs", {message});
});