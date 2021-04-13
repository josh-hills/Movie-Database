const express = require('express');
const mongoose = require("mongoose");
const searchRouter = express.Router();

const app = require('../server');
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;


//Create router
searchRouter.get("/", async (req, res, next)=> {
    db.collection("movies").find().toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        console.log("Search Successful: ")
        console.log(results.length + " Movies Listed")
        res.status(200).render("pages/search",{searchResults: results.splice(0,10)});
    });
});

searchRouter.post("/", async (req, res, next) => {
    console.log("Search Button Pressed");
    console.log();
    console.log("Title: " + req.body.title);
    console.log("Genre: " + req.body.genre);
    console.log("Actor Name: " + req.body.actorName);
    console.log();
    //Query for collection

    db.collection("movies").find({
        //Query for each param
        $or: [
            {title: req.body.title},
            {genre: req.body.genre},
            {actors: req.body.actorName}
        ]}).collation({locale: 'en', strength: 2}).toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        //Results is the arraylist of movies
        console.log("Search Successful: ")
        console.log(results.length + " Movies Listed")
        res.status(200).render("pages/search",{searchResults: results.splice(0,10)});
    });
});



module.exports = searchRouter;