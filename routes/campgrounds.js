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
            console.log("New Camp inserted!!!!");
        }
    });
});

router.get("/new", (req, res)=>{
    res.render("campgrounds/new");
})

router.get("/:id", (req, res) =>{
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

module.exports = router;