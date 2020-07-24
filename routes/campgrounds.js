const { route } = require("./comments");

const express = require("express"),
      Campground = require("../models/campground"),
      router  = express.Router();

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
            camp.author = req.user;
            camp.save();
            console.log("New Camp inserted!!!!");
            res.redirect("/campgrounds")
        }
    });
});

router.get("/new", isLoggedIn, (req, res)=>{
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

router.get("/:id/edit", (req, res)=>{
    Campground.findById(req.params.id, (err, camp)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/edit", {camp: camp});
        }
    });
});

router.put("/:id", (req, res)=>{
    Campground.updateOne({_id: req.params.id}, req.body.camp, (err, camp)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Successfully edited");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/:id", (req, res)=>{
    Campground.deleteOne({_id: req.params.id}, (err, camp)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;