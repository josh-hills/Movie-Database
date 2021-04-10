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
    let id;
	try{
		id = req.query.id;
        console.log(id);
	}catch{
		res.status(404).send("Unknown ID");
		return;
	}

    find('movies', {_id : id}, function (err, docs) {
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