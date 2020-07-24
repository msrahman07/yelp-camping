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

router.get("/login", (req, res)=>{
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureMessage: "Invalid username or password"
}) ,(req, res)=>{

});

router.get("/logout", (req, res)=>{
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
router.get("/", function(req, res){
    res.render("home.ejs");
});

module.exports = router;
