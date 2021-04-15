const express = require('express');
const mongoose = require("mongoose");
const indexRouter = express.Router();

const app = require('../server');
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;

//Create router
indexRouter.get("/", async (req, res, next)=> {
    db.collection("movies").find().toArray( function(err, results){
        if(err){
            res.status(500).send("Error Reading Database.");
            return;
        }
        console.log("Search Successful: ")
        console.log(results.length + " Movies Listed")      
        res.status(200).render("pages/index",{movieResults: results.splice(counter,5)});
    });
});

module.exports = indexRouter;