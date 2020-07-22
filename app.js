const express = require("express"),
    mongoose = require("mongoose"),
    app = express(),
    bodyParser = require("body-parser");

//const { urlencoded } = require("express");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

//database mongodb connection
// const MongoClient = require('mongodb').MongoClient;
// const ObjectId = require('mongodb');
// const url = 'mongodb://127.0.0.1:27017';
// const dbName = 'yelp-camp'
//let db
// DB connection
mongoose.connect("mongodb://localhost/yelp-camp", { useNewUrlParser: true, useUnifiedTopology: true });
let Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDb = require("./seed");
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
        res.render("index.ejs", {camps : campgrounds})
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
    res.render("new");
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
            res.render("show.ejs", {camp : camp});
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

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.listen(3000, function(){
    console.log("server started");
});