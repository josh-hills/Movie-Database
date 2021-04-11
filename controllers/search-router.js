const express = require('express');
const mongoose = require("mongoose");
const searchRouter = express.Router();
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
    //Query for collection
    db.collection("movies").find({Year: {$gt: 2000}}).toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        console.log("Search Successful: ")
        console.log(results.length + " Movies Listed")
        res.status(200).render("pages/search",{searchResults: results.splice(0,10)});
    });
});


/*
//function that queries the id for the passed query, using promises ensures that we can wait for the end of the function
function find (query) {
    return new Promise((resolve, reject) => {
        db.collection("movies").findOne({_id:query},function(err, result){
            if(err){
                reject("Error reading database.");
            }
            if(!result){
                reject("ID not found");
            }
            resolve(result);
        })
    });
}
*/
module.exports = searchRouter;