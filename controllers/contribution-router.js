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
        console.log(results.length + " Movies currently in database.")
        res.status(200).render("pages/contribute");
    })
});

contributionRouter.post("/actor", async (req, res, next) => {
    console.log("ADD ACTOR BUTTON PRESSED.")
    db.collection("people").find({name: req.body.actor}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        console.log("Search Successful: ")
        if (results.length > 0){
            console.log("Sorry there is already a person with that name.")
        }
        else{

            db.collection("people").insertOne({
                name: req.body.actor
            });
        }

        db.collection("people").find({name: req.body.actor}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
            if(err){
                res.status(500).send("Error Reading Database.");
                return;
            }

        console.log(results)
        res.status(200).render("pages/contribute");      
        });  
    });
});

contributionRouter.post("/movie", async (req, res, next) => {
    console.log("ADD MOVIE BUTTON PRESSED.")
    
    //Check if people exist
    let newActor;
    let newWriter;
    let newDirector;

    //WRITER
    if (req.body.writer != "" || req.body.writer != null){
    db.collection("people").find({name: req.body.writer}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        console.log("Search Successful: ")
        if (results.length > 0){
            console.log("Sorry there is already a person with that name.")
        }
        else{
            db.collection("people").insertOne({
                name: req.body.writer
            });
        }
    });
}
    //DIRECTOR
    if (req.body.director != "" || req.body.director != null){
    db.collection("people").find({name: req.body.director}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        console.log("Search Successful: ")
        if (results.length > 0){
            console.log("Sorry there is already a person with that name.")
        }
        else{

            db.collection("people").insertOne({
                name: req.body.director
            });
        }
    });
}
    //ACTOR
    if (req.body.actor != "" || req.body.actor != null){
    db.collection("people").find({name: req.body.actor}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        console.log("Search Successful: ")
        if (results.length > 0){
            console.log("Sorry there is already a person with that name.")
        }
        else{

            db.collection("people").insertOne({
                name: req.body.actor
            });
        }
    });
}



    var newMovie = {
        title: req.body.movieTitle,
        runtime: req.body.movieRuntime,
        year: req.body.movieRelease,
        genre: req.body.genre

    }
    console.log(newMovie)
    db.collection("movies").insertOne(newMovie);
    db.collection("movies").find().toArray( function(err, results){
        if (err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        console.log("Movie Added: " + newMovie)
        console.log(results.length + " Movies in Database.")
        res.status(200).render("pages/contribute"); 
    })
    
});


module.exports = contributionRouter;