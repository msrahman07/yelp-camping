//===================================================
// regular modules
const express   = require("express"),                   // import expressjs
    Campground  = require("./models/campground"),       // import models
    Comment     = require("./models/comment"),
    seedDb      = require("./seed"),                    // seed db from seed.js
    mongoose    = require("mongoose"),                  // mongoose for mongodb
    app         = express(),                            // run express() as app
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

//const { urlencoded } = require("express");

app.set('view engine', 'ejs');                          // all views will be ejs files
app.use(bodyParser.urlencoded({extended : true}));      // use of body-parser
app.use(express.static(__dirname + '/public'));         // include public directory for css and js
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
});
//database mongodb connection
// const MongoClient = require('mongodb').MongoClient;
// const ObjectId = require('mongodb');
// const url = 'mongodb://127.0.0.1:27017';
// const dbName = 'yelp-camp'
//let db
// DB connection

//connect mongodb using mongoose
mongoose.connect("mongodb://localhost/yelp-camp", { useNewUrlParser: true, useUnifiedTopology: true });
seedDb();


// MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
//     if (err) return console.log(err)

//     // Storing a reference to the database so you can use it later
//     db = client.db(dbName)
//     console.log(`Connected MongoDB: ${url}`)
//     console.log(`Database: ${dbName}`);
//     //client.close();
// });
// Campground.create({
//     name: "Scott's Island",
//     image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     description: "Nice place, great view. lots of bears"
// });

app.get("/campgrounds", (req, res) => {
    Campground.find((err, campgrounds)=>{
        if(err){
            console.log(err);
        }
        else{
        res.render("campgrounds/index.ejs", {camps : campgrounds})
        //res.send("Hola");
        }
    });
});
app.post("/campgrounds", (req, res) => {
    console.log(req.body.camp);
    Campground.create(req.body.camp, (err, camp)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("New Camp inserted!!!!");
        }
    });
});

app.get("/campgrounds/new", (req, res)=>{
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id", (req, res) =>{
    //console.log(req.params.id)
    Campground.findById(req.params.id).populate("comments").exec((err, camp)=>{
        if(err){
            console.log(err);
        }
        else{
            //res.send(req.params.id)
            console.log(camp.comments[0].text)
            res.render("campgrounds/show.ejs", {camp : camp});
        }
    })
    // db.collection("campgrounds").findOne({_id: parseInt(req.params.id)})
    //     .then(data => {
    //         //console.log(data);
    //         res.render("show.ejs", {camp : data});

    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    //console.log(camp)
    //console.log(campground);
});
//========================================================
app.get("/campgrounds/:id/comments/new", isLoggedIn ,(req, res)=>{
    Campground.findById(req.params.id, (err, camp)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {camp: camp});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn,(req, res)=>{
    Comment.create(req.body.comment, (err, comment)=>{
        if(err){
            console.log(err);
        }
        else{
            Campground.findById(req.params.id, (err, camp)=>{
                if(err){
                    console.log(err);
                }
                else{
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/campgrounds/"+camp._id);
                }                
            });
        }
    })
});

// Auth routes
app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res, next)=>{
    User.register(
        new User({
            username: req.body.username
        }),
        req.body.password,
        (err, user)=>{
            if(err){
                return res.redirect('/register');
            }
            next()
        }
    );
}, passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/',
    failureMessage: 'registration failed'
}));

app.get("/login", (req, res)=>{
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureMessage: "Invalid username or password"
}) ,(req, res)=>{

});

app.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

//========================================================
app.get("/", function(req, res){
    res.render("home.ejs");
});

app.listen(3000, function(){
    console.log("server started");
});