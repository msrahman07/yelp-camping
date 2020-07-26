const express = require("express"),
      User = require("../models/user"),
      passport = require("passport")
      router  = express.Router();

router.get("/register", (req, res)=>{
    res.render("register");
});

router.post("/register", (req, res, next)=>{
    User.register(
        new User({
            username: req.body.username
        }),
        req.body.password,
        (err, user)=>{
            if(err){
                req.flash("error", err.message);
                return res.redirect('/register');
            }
            next();
        }
    );
}, passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/register',
    failureFlash: 'registration failed',
    successFlash: 'Welcome to yelp-camp'
}));

router.get("/login", (req, res)=>{
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: "Incorrect username or password",
    successFlash: "Welcome to yelp-camp"
    //failureMessage: "Invalid username or password"
}) ,(req, res)=>{

});

router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success", "Logged you out")
    res.redirect("/campgrounds");
});

//========================================================
router.get("/", function(req, res){
    res.render("landing.ejs");
});

module.exports = router;
