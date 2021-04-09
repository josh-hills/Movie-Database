const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const fs = require("fs");
const movieRouter = express.Router();
mongoose.connect('mongodb://localhost/movies', {useNewUrlParser: true});
let connection = mongoose.connection;


//Create router
//if you wanna test this, go grab any valid id and paste it for the id param in find
movieRouter.get("/", (req, res, next)=> {
    find('movies', {_id : "6YVMWXmY4t4c0UC2cjuwo"}, function (err, docs) {
        let myMovie = docs[0];
        doRender(req, res, next, myMovie);
    });   
});


async function find (name, query, cb) {
    mongoose.connection.db.collection(name, function (err, collection) {
       collection.find(query).toArray(cb);
   });
}

async function doRender(req, res, next, myMovie){
    console.log("Ac: " + myMovie.Actors[0]);
    console.log(myMovie);
    res.render("pages/movie", {myMovie}); 
}


module.exports = movieRouter;