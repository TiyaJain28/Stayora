if(process.env.NODE_ENV !="production"){
require('dotenv').config();}
console.log(process.env.SECRET);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");



const session=require("express-session");
const flash=require("connect-flash");


const passport=require("passport");
const LocalStrategy = require("passport-local").Strategy;
const user=require("./models/user.js");





const dbURL=process.env.ATLASDB_URL;


// DB Connection
main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}

// App Config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const MongoStore = require("connect-mongo");

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET || "mysupersecretcode",
  },
  touchAfter: 24 * 3600,
});
store.on("error",()=>{
  console.log("error in mongo session store",err);
});


const sessionOptions={
  store,
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    httpOnly:true
  },
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());







app.use((req,res,next)=>
{
  res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
  next();
})

app.get("/", (req, res) => {
  res.redirect("/listings");
});



app.use("/listings",listingRouter);

app.use("/listings/:id/reviews/",reviewRouter);

app.use("/",userRouter);




app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  res.status(statusCode).render("error.ejs",{message});
});

// Server
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
