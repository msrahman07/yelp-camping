const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const { urlencoded } = require("express");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

//database mongodb connection
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'yelp-camp'
let db
let id = 0

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err)

    // Storing a reference to the database so you can use it later
    db = client.db(dbName)
    console.log(`Connected MongoDB: ${url}`)
    console.log(`Database: ${dbName}`);

    app.get("/campgrounds", (req, res) => {
        db.collection('campgrounds').find().toArray()
            .then(campgrounds => {
                //console.log(campgrounds);
                res.render("index.ejs", {camps : campgrounds});
            })
            .catch(err => {
                console.log(err)
            });
        
    });
    app.post("/campgrounds", (req, res) => {
        //console.log(req.body);
        db.collection('campgrounds').insertOne(
            {
                '_id': id, 
                'name': req.body.name, 
                'image': req.body.image,
                'description' : req.body.description
            })
            .then(results => {
                id += 1;
                res.redirect("/campgrounds");
            })
            .catch(err =>{
                console.log(err);
            });
        //data.push({name: req.body.name, image: req.body.image});
    });

    app.get("/campgrounds/:id", (req, res) =>{
        //console.log(req.params.id)
        db.collection("campgrounds").findOne({_id: parseInt(req.params.id)})
            .then(data => {
                //console.log(data);
                res.render("show.ejs", {camp : data});

            })
            .catch(err => {
                console.log(err);
            })
        //console.log(camp)
        //console.log(campground);
    });
    //client.close();
});

app.get("/", function(req, res){
    res.render("home.ejs");
});


app.get("/campgrounds/new", (req, res) =>{
    res.render("new.ejs");
});


app.listen(3000, function(){
    console.log("server started");
});