const express = require('express');
const mongoose = require("mongoose");
const userRotuer = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;

//loops through the users watchlist and adds it to the userWatchlist array, this and userProfile are passed to user.pug
userRotuer.get("/", async (req, res, next)=> {
    try{
        let userProfile = await find("users","username",req.query.username);
        let userWatchlist = [];
        for(let i = 0; i < userProfile.watchlist.length; i++){
            let id = userProfile.watchlist[i].id;
            let mov = await find("movies","_id",id);
            userWatchlist.push(mov);
        }
        doRender(req, res, next, userProfile, userWatchlist);
    } catch(error){
        res.status(404).send("404 Error");
    }
});

//function that queries the id for the passed query, using promises ensures that we can wait for the end of the function
//i is var to look at (ex. _id), q is query
function find (coll,i,q) {
    return new Promise((resolve, reject) => {
        let query = {};
        query[i] = q;
        db.collection(coll).findOne(query,function(err, result){
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

//renders user page
function doRender(req, res, next, userProfile, userWatchlist){
    res.render("pages/user", {userProfile, userWatchlist}); 
}

module.exports = userRotuer;