const express = require('express');
const mongoose = require("mongoose");
const profileRotuer = express.Router();
mongoose.connect('mongodb://localhost/movies', {useNewUrlParser: true});
let db = mongoose.connection;

//loops through the users watchlist and adds it to the myWatchlist array, this and myProfile are passed to profile.pug
profileRotuer.get("/", async (req, res, next)=> {
    let myProfile = require("../me.json");
    let myWatchlist = [];
    try{
        for(let i = 0; i < myProfile.watchlist.length; i++){
            let id = myProfile.watchlist[i].id;
            let mov = await find(id);
            myWatchlist.push(mov);
        }

        doRender(req, res, next, myProfile, myWatchlist);
    } catch(error){
		res.status(404).send("404 Error");
    }
});

//function that queries the id for the passed query, using promises ensures that we can wait for the end of the function
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

//renders profile page
function doRender(req, res, next, myProfile, myWatchlist){
    res.render("pages/profile", {myProfile, myWatchlist}); 
}

module.exports = profileRotuer;