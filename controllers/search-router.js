const express = require('express');
const mongoose = require("mongoose");
const searchRouter = express.Router();

const app = require('../server');
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;
let counter = 0;
let curSearch = [];

//Create router
searchRouter.get("/", async (req, res, next)=> {
    db.collection("movies").find().toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        //counter = 0;
        console.log("Search Successful: ")
        console.log(results.length + " Movies Listed")
        res.status(200).render("pages/search",{searchResults: results.splice(counter,10), counter});
    });
});

//When the search button is clicked
searchRouter.post("/", async (req, res, next) => {
    console.log("Search Button Pressed");
    counter = 0;
    let actor = [];
    if (req.body.actorName != "")
    {
        actor = await find("people","name",req.body.actorName, res)
    }
    //Query for collection
    db.collection("movies").find({
        //Query for each param
        $or: [
            {title: req.body.title},
            {genre: req.body.genre},
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
        res.status(200).render("pages/search",{searchResults: results.splice(0,10), counter});
    });
});


searchRouter.post("/next", async (req, res, next) => {
    
    console.log("Next Button Pressed.")
    counter += 5;
    res.redirect("/search");
});
searchRouter.post("/prev", async (req, res, next) => {
    console.log("Previous Button Pressed")
    if ((counter-5) < 0){
        counter = 0;
    }else{
        counter -= 5;
    }
    res.redirect("/search");
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