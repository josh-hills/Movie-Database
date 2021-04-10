const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const fs = require("fs");
const profileRotuer = express.Router();
const Movie = require("../MovieModel.js");
mongoose.connect('mongodb://localhost/movies', {useNewUrlParser: true});
let db = mongoose.connection;

profileRotuer.get("/", async (req, res, next)=> {
    let myProfile = require("../me.json");
    let myWatchlist = [];
    try{
        for(let i = 0; i < myProfile.watchlist.length; i++){
            let id = myProfile.watchlist[i].id;
            let mov = await find(id);
            console.log(mov);
            myWatchlist.push(mov);
        }

        doRender(req, res, next, myProfile, myWatchlist);
    } catch(error){
		res.status(404).send("404 Error");
    }
});


function find (query) {
    return new Promise((resolve, reject) => {
        db.collection("movies").findOne({_id:query},function(err, result){
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

function doRender(req, res, next, myProfile, myWatchlist){
    res.render("pages/profile", {myProfile, myWatchlist}); 
}

module.exports = profileRotuer;