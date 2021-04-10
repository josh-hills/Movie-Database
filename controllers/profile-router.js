const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const fs = require("fs");
const profileRotuer = express.Router();
mongoose.connect('mongodb://localhost/movies', {useNewUrlParser: true});
let connection = mongoose.connection;

profileRotuer.get("/", (req, res, next)=> {
    let myProfile = require("../me.json");
    let myWatchlist = [];
    for(let i = 0; i < myProfile.watchlist.length; i++){
        let id = myProfile.watchlist[i].id;
        find('movies', {_id : id}, function (err, docs) {
            let myMovie = docs[0];
            console.log(id);
            myWatchlist.push(myMovie);
            if(!(i < myProfile.watchlist.length-1)){
                console.log("x")
                doRender(req, res, next, myProfile, myWatchlist);
            }
        });
    }
});

async function find (name, query, cb) {
    mongoose.connection.db.collection(name, function (err, collection) {
       collection.find(query).toArray(cb);
   });
}

async function doRender(req, res, next, myProfile, myWatchlist){
    console.log(myWatchlist);
    res.render("pages/profile", {myProfile, myWatchlist}); 
}

module.exports = profileRotuer;