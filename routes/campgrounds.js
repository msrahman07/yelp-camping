const { route } = require("./comments");

const express = require("express"),
      Campground = require("../models/campground"),
      router  = express.Router(),
      middleware = require("../middleware/index");

router.get("/", (req, res) => {
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
router.post("/", (req, res) => {
    console.log(req.body.camp);
    Campground.create(req.body.camp, (err, camp)=>{
        if(err){
            console.log(err);
        }
        else{
            camp.author.id = req.user._id;
            camp.author.username = req.user.username;
            
            camp.save();
            console.log("New Camp inserted!!!!"+camp.author.id);
            req.flash("success", "Successfully created campground!!")
            res.redirect("/campgrounds")
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res)=>{
    res.render("campgrounds/new");
})

router.get("/:id", (req, res) =>{
    console.log(req.params.id)
    Campground.findById(req.params.id).populate("comments").exec((err, camp)=>{
        if(err){
            console.log("err");
        }
        else{
            //res.send(req.params.id)
            //console.log(camp.comments[0].text)
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
//Edit show page
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, camp)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("id: "+camp.author.id);
            if(camp.author.id.equals(req.user._id)){
                res.render("campgrounds/edit", {camp: camp});
            }
            else{
                res.redirect("/campgrounds/"+camp._id)
            }
        }
    });
});
// Update route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.updateOne({_id: req.params.id}, req.body.camp, (err, camp)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            console.log(err);
        }
        else{
            console.log("Successfully edited");
            req.flash("success", "Successfully edited campground!!")
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
// Delete route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndDelete(req.params.id, (err, camp)=>{
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong!!");
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            req.flash("success", "Successfully deleted campground!!")
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;