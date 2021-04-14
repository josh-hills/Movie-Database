const express = require('express');

const mongoose = require("mongoose");
const contributionRouter = express.Router();
const { nanoid } = require('nanoid');
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

//CREATING A NEW PERSON

contributionRouter.post("/newPerson", async (req, res, next) => {
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
                _id: nanoid(),
                director: [],
                writer: [],
                actor: [],
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
    var newMovie = {
        _id: nanoid(),
        title: req.body.movieTitle,
        year: req.body.movieRelease,
        rated: req.body.movieRating,
        runtime: req.body.movieRuntime,
        genre: req.body.movieGenre,
        director: [],
        writer: [],
        actor: [],
        plot: req.body.moviePlot,
        awards: req.body.movieAwards
    }   
    //Checking if people exist
    //DIRECTOR CHECK
    await db.collection("people").find({name: req.body.movieDirector}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
        if (err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        //if results.length > 0, it means there exists a person with that name
        if (results.length > 0){
            newMovie.director.push(results[0]._id); 
        }else{
            console.log("Person does not exists: Create Person First")

            return;
        }
    });
    //WRITER CHECK
    await db.collection("people").find({name: req.body.movieWriter}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
        if (err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        //if results.length > 0, it means there exists a person with that name
        if (results.length > 0){
            newMovie.writer.push(results[0]._id); 
            //console.log(newMovie)
        }else{
            console.log("Person does not exists: Create Person First")
            return;
        }
    });
    //ACTOR CHECK
    await db.collection("people").find({name: req.body.movieActor}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
        if (err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        //if results.length > 0, it means there exists a person with that name
        if (results.length > 0){
            newMovie.actor.push(results[0]._id); 
            console.log(newMovie)
        }else{
            console.log("Person does not exists: Create Person First")
            return;
        }
    });

/*
    if (newMovie.plot == undefined){
        newMovie.plot = "";
    }
    if (newMovie.awards == ''){
        newMovie.awards= "N/A";
    }
    */
    //Check if movie title already exists
    db.collection("movies").find({title: newMovie.title}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
        if (err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        //if title exists, don't add movie to database and rerender page
        if (results.length > 0){
            console.log("MOVIE ALREADY EXISTS");
            res.status(200).render("pages/contribute");
        }else{
            console.log("INSERTING MOVIE")
            db.collection("movies").insertOne(newMovie)
            res.status(200).render("pages/contribute");
        }
    })
});
//My reference for movie structure:
/*
[{"Title":"Meatballs 4",
"Year":"1992",
"Rated":"R",
"Released":"04 Dec 1992",
"Runtime":"84 min",
"Genre":["Comedy"],
"Director":["Bob Logan"],
"Writer":["Bob Logan"],
"Actors":["Corey Feldman","Jack Nance","Sarah Douglas","Bojesse Christopher"],
"Plot":"Ricky is the hottest water-ski instructor around and he has just be rehired by his former employer/camp to whip up attendance. But the camp is in serious financial trouble and the owner of ...",
"Awards":"N/A",
"Poster":"https://m.media-amazon.com/images/M/MV5BZjY1NDZjYjYtZjRmMi00M2NhLTllMDktZDg2ZTRmNDA4Njc5XkEyXkFqcGdeQXVyNjQ4NTg2ODY@._V1_SX300.jpg"
}]
*/
module.exports = contributionRouter;