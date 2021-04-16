const express = require('express');

const mongoose = require("mongoose");
const contributionRouter = express.Router();
const { nanoid } = require('nanoid');
const app = require('../server');

mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;


//Create router
contributionRouter.get("/", async (req, res, next)=> {
    let myProfile = await find("users","username",req.session.username);
    console.log(myProfile.followedPeople)
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

//ADDING A NEW MOVIE
contributionRouter.post("/movie", async (req, res, next) => {
    let myProfile= await find("users","username",req.session.username);

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
        awards: req.body.movieAwards,
        poster: "",
        reviews: []
    }   
    //Checking if people exist
    //DIRECTOR CHECK
    let curDirector = await find("people","name",req.body.movieDirector,res);
    newMovie.director.push(curDirector._id);
    db.collection("people").updateOne({name: req.body.movieDirector}, {$push:{director: newMovie._id}});
    
    let curWriter = await find("people","name",req.body.movieWriter,res);
    newMovie.writer.push(curWriter._id);
    db.collection("people").updateOne({name: req.body.movieDirector}, {$push:{director: newMovie._id}});

    let curActor = await find("people","name",req.body.movieActor,res);
    newMovie.actor.push(curActor._id);
    db.collection("people").updateOne({name: req.body.movieDirector}, {$push:{director: newMovie._id}});

    if (newMovie.awards == ''){
        newMovie.awards= "N/A";
    }
    
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
            console.log(newMovie)
            db.collection("movies").insertOne(newMovie)
            res.status(200).render("pages/contribute");
        }
    })
});

function find (coll,i,q, res) {
    return new Promise((resolve, reject) => {
        let query = {};
        query[i] = q;
        db.collection(coll).findOne(query,function(err, result){
            if(err){
                res.status(500).send("Error reading database.");
                return;
            }
            if(!result){
                res.status(404).send("Unknown ID, if you are adding a new person to a movie, please ensure you have created them first.");
                return;
            }
            resolve(result);
        })
    });
}


module.exports = contributionRouter;