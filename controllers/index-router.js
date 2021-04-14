const express = require('express');
const mongoose = require("mongoose");
const indexRouter = express.Router();

const app = require('../server');
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;
let curList = [];
let counter;
//Create router
indexRouter.get("/", async (req, res, next)=> {
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
        
        res.status(200).render("pages/search",{movieResults: results.splice(counter,10)});
    });
});

module.exports = indexRouter;