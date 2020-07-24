const express = require("express"),
      Campground = require("../models/campground"),
      Comment = require("../models/comment"),
      router  = express.Router({mergeParams: true});

router.get("/new", isLoggedIn ,(req, res)=>{
    Campground.findById(req.params.id, (err, camp)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {camp: camp});
        }
    });
});

router.post("/", isLoggedIn,(req, res)=>{
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;
