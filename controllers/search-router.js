const express = require('express');
const mongoose = require("mongoose");
const searchRouter = express.Router();

const app = require('../server');
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;
let curList = [];
let counter;

//Create router
searchRouter.get("/", async (req, res, next)=> {
    let counter = 0;
    
    db.collection("movies").find().toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        console.log("Search Successful: ")
        console.log(results.length + " Movies Listed")
        console.log("COUNTER IS AT: " + counter)
        curList=results;
        
        res.status(200).render("pages/search",{searchResults: results.splice(counter,10), counterNum: counter});
    });
    
   
});
/*
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
*/
searchRouter.post("/", async (req, res, next) => {
    console.log("Search Button Pressed");
    console.log();
    console.log("Title: " + req.body.title);
    console.log("Genre: " + req.body.genre);
    console.log("Actor Name: " + req.body.actorName);
    console.log(req.body);
    counter = req.body
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
        curList=results;
        console.log("COUNTER IS AT: " + counter)
        res.status(200).render("pages/search",{searchResults: results.splice(counter,10)});
    });
});

searchRouter.post("/next", async (req, res, next) => {
    counter = req.body.counterNum;
    counter+=5
    console.log("COUNTER IS AT: " + counter);
    
    console.log(curList.length + " in curList before splice.")
    console.log("COUNTER IS AT: " + counter)
    let dummyList = curList.slice(counter, 10)
    console.log(curList.length + " in curList before splice.")
    res.status(200).render("pages/search",{searchResults: dummyList, counterNum: counter});
    
});
searchRouter.post("/prev", async (req, res, next) => {
    counter = req.body.counterNum;
    if((counter -5) <0){
        counter=0
    }else{
    counter-=5
    }
    console.log("COUNTER IS AT: " + counter);
    
    console.log(curList.length + " in curList before splice.")
    let dummyList = curList.slice(counter,10)
    console.log("COUNTER IS AT: " + counter)
    console.log(curList.length + " in curList before splice.")
    res.status(200).render("pages/search",{searchResults: dummyList, counterNum: counter});
    

});

module.exports = searchRouter;