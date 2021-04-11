const express = require('express');
const mongoose = require("mongoose");
const profileRotuer = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;

//loops through the users watchlist and adds it to the myWatchlist array, this and myProfile are passed to profile.pug
profileRotuer.get("/", async (req, res, next)=> {
    if(req.session.loggedin){
        let myProfile = await find("users","username",req.session.username);
        let myWatchlist = [];
        try{
            for(let i = 0; i < myProfile.watchlist.length; i++){
                let id = myProfile.watchlist[i].id;
                let mov = await find("movies","_id",id);
                myWatchlist.push(mov);
            }
    
            doRender(req, res, next, myProfile, myWatchlist);
        } catch(error){
            res.status(404).send("404 Error");
        }
    } else {
        return res.redirect("/signin");
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

//renders profile page
function doRender(req, res, next, myProfile, myWatchlist){
    res.render("pages/profile", {myProfile, myWatchlist}); 
}

module.exports = profileRotuer;