//===================================================
// regular modules
const express   = require("express"),                   // import expressjs
    Campground  = require("./models/campground"),       // import models
    Comment     = require("./models/comment"),
    seedDb      = require("./seed"),                    // seed db from seed.js
    mongoose    = require("mongoose"),                  // mongoose for mongodb
    app         = express(),                            // run express() as app
    methodOverride = require("method-override"),
    bodyParser  = require("body-parser");               // needed to parse request body

//==================================================
// Modules for authentication
const passport  = require("passport"),
      LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

// Passport config
app.use(require("express-session")({
    secret: "savera",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//==================================================


app.set('view engine', 'ejs');                          // all views will be ejs files
app.use(bodyParser.urlencoded({extended : true}));      // use of body-parser
app.use(express.static(__dirname + '/public'));         // include public directory for css and js
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
});
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/yelp-camp", { useNewUrlParser: true, useUnifiedTopology: true });
//seedDb();

const commentRoutes    = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      authRoutes       = require("./routes/index");

app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
    console.log("server started");
});