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
                    //add username and id to comment
                    comment.author = req.user;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    console.log(comment);
                    res.redirect("/campgrounds/"+camp._id);
                }                
            });
        }
    })
});

router.get("/:comment_id/edit", (req, res)=>{
    Campground.findById(req.params.id, (err, camp)=>{
        if(err){
            res.redirect("back");
        }
        else{
            Comment.findById(req.params.comment_id, (err, comment)=>{
                res.render("comments/edit", {camp: camp, comment: comment});
            });
        }
    })
});

router.put("/:comment_id", (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
            res.redirect("/campgrounds/"+req.params.id);
    });
});

router.delete("/:comment_id", (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err, result)=>{
        if(err){
            res.redirect("back");
        }
        else{
            console.log("Successfully deleted");
            res.redirect("back");
        }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;
