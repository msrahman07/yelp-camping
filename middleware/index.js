//all middleware goes here
const Campground  = require("../models/campground"),       // import models
    Comment     = require("../models/comment");
    
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = 
    function (req, res, next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, (err, camp)=>{
                if(err){
                    req.flash("error", "Campground not found!!");
                    console.log(err);
                }
                else{
                    if(camp.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error", "You don't have permission to do that!!")
                        res.redirect("back");
                    }
                }
            });
        }
        else{
            req.flash("error", "You need to be logged in!!")
            res.redirect("back");
        }
    };
middlewareObj.checkCommentOwnership = 
    function (req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, (err, comment)=>{
                if(err){
                    req.flash("error", "Cannot find the comment!!")
                    res.redirect("back");
                }
                else{
                    if(comment.author.id.equals(req.user.id)){
                        next();
                    }
                    else{
                        req.flash("error", "You don't have permission!!")
                        res.redirect("back");
                    }
                }
            });
        }
        else{
            req.flash("error", "You need to be logged in!!")
            res.redirect("back")
        }
    };
middlewareObj.isLoggedIn = 
    function (req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "Please Login First!!");
        res.redirect("/login"); 
    };
    
    
module.exports = middlewareObj;