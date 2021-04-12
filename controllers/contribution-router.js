const express = require('express');

const mongoose = require("mongoose");
const contributionRouter = express.Router();

const app = require('../server');
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;


//Create router
contributionRouter.get("/", async (req, res, next)=> {
    db.collection("movies").find().toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        console.log(results.length)
        res.status(200).render("pages/contribute");
    })
});

contributionRouter.post("/actor", async (req, res, next) => {
    console.log("ADD ACTOR BUTTON PRESSED.")
    console.log(req.body)
    res.status(200).render("pages/contribute");
});

contributionRouter.post("/movie", async (req, res, next) => {
    console.log("ADD MOVIE BUTTON PRESSED.")

    var movie = req.body;
    console.log(movie)
    db.collection("movies").insertOne(movie);
    db.collection("movies").find().toArray( function(err, results){
        if (err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        console.log("Movie Added: " + movie)
        console.log(results.length + "Movies in Database.")
        res.status(200).render("pages/contribute"); 
    })
    
});


module.exports = contributionRouter;