const express = require("express"),
      Campground = require("../models/campground"),
      Comment = require("../models/comment"),
      middleware = require("../middleware/index");
      router  = express.Router({mergeParams: true});

router.get("/new", middleware.isLoggedIn ,(req, res)=>{
    Campground.findById(req.params.id, (err, camp)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {camp: camp});
        }
    });
});

router.post("/", middleware.isLoggedIn,(req, res)=>{
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
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
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

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
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

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
            res.redirect("/campgrounds/"+req.params.id);
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
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

module.exports = router;
