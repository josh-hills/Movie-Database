const express = require('express');
const mongoose = require("mongoose");
const searchRouter = express.Router();

const app = require('../server');
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;
let counter = 0;
let curSearch = [];
//GET LOCAL PARAMETERS
let curTitle = "";
let curGenre = "";
let curActor = "";
let status = "searching";
//Create router
searchRouter.get("/", async (req, res, next)=> {


    if(status == "searching")
    {
        curTitle = "";
        curGenre = "";
        curActor = "";
        counter = 0;
        status = "Reset"
    }
    console.log("STATUS: " + status)
    db.collection("movies").find().toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        //console.log("Search Successful: ")
        //console.log(results.length + " Movies Listed")
        res.status(200).render("pages/search",{searchResults: results.splice(counter,10), counter});
    });
});

//When the search button is clicked
searchRouter.post("/", async (req, res, next) => {
    console.log("Search Button Pressed");
    counter = 0;

    status = "searching";
    curTitle = req.body.title;
    curGenre = req.body.genre;
    curActor = req.body.actorName;

    console.log("STATUS: " + status)

    let actor = [];
    if (curActor != "")
    {
        actor = await find("people","name", curActor, res)
    }
    //Query for collection
    db.collection("movies").find({
        //Query for each param
        $or: [
            {title: curTitle},
            {genre: curGenre},
            {actor: actor._id}
        ]}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        //Results is the arraylist of movies
        //counter = 0;
        console.log("Search Successful: ")
        console.log(results.length + " Movies Listed")
        res.status(200).render("pages/search",{searchResults: results.splice(counter,10), counter});
    });
});


searchRouter.post("/next", async (req, res, next) => {
    console.log("Next Button Pressed.")
    counter += 10;

    console.log("Local Title: " + curTitle);
    console.log("Local Genre: " + curGenre);
    console.log("Local Actor: " + curActor);
    //Checking if there was a search
    if((curTitle == "") && (curGenre == "") && (curActor == "")){
        res.redirect("/search")
    }else{
        let actor = [];
        if (curActor != "")
        {
            actor = await find("people","name",curActor, res)
            
        }
        //Query for collection
        db.collection("movies").find({
            //Query for each param
            $or: [
                {title: curTitle},
                {genre: curGenre},
                {actor: actor._id}
            ]}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
            if(err){
                res.status(500).send("Error Reading Database.");
                return;
            }
            //Results is the arraylist of movies
            //counter = 0;
            console.log("Search Successful: ")
            console.log(results.length + " Movies Listed")
            res.status(200).render("pages/search",{searchResults: results.splice(counter,10), counter});
        });
    }
});
searchRouter.post("/prev", async (req, res, next) => {
    console.log("Previous Button Pressed")
    if ((counter-10) < 0){
        counter = 0;
    }else{
        counter -= 10;
    }

    console.log("Local Title: " + curTitle);
    console.log("Local Genre: " + curGenre);
    console.log("Local Actor: " + curActor);

    if((curTitle == "") && (curGenre == "") && (curActor == "")){
        res.redirect("/search");
    }else{

        let actor = [];
        if (curActor != "")
        {
            actor = await find("people","name",curActor, res)
            
        }
        //Query for collection
        db.collection("movies").find({
            //Query for each param
            $or: [
                {title: curTitle},
                {genre: curGenre},
                {actor: actor._id}
            ]}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
            if(err){
                res.status(500).send("Error Reading Database.");
                return;
            }
            //Results is the arraylist of movies
            //counter = 0;
            console.log("Search Successful: ")
            console.log(results.length + " Movies Listed")
            res.status(200).render("pages/search",{searchResults: results.splice(counter,10), counter});
        });
    }
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
                res.status(404).send("Unknown ID");
                return;
            }
            resolve(result);
        })
    });
}
module.exports = searchRouter;