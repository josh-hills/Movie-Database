const express = require('express');
const mongoose = require("mongoose");
const profileRotuer = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;
var bodyParser = require('body-parser')
//loops through the users watchlist and adds it to the myWatchlist array, this and myProfile are passed to profile.pug
profileRotuer.get("/", async (req, res, next)=> {
    if(req.session.loggedin){
        let myProfile = await find("users","username",req.session.username);
        let myWatchlist = [];
        let myFollowedPeople = [];
        let myFollowedUsers = [];
        try{
            for(let i = 0; i < myProfile.watchlist.length; i++){
                let id = myProfile.watchlist[i].id;
                let mov = await find("movies","_id",id, res);
                myWatchlist.push(mov);
            }
            for(let i = 0; i < myProfile.followedPeople.length; i++){
                let pid = myProfile.followedPeople[i]._id;
                let person = await find("people","_id",pid, res);
                myFollowedPeople.push(person);
            }
            for(let i = 0; i < myProfile.followedUsers.length; i++){
                let un = myProfile.followedUsers[i].username;
                let user = await find("users","username",un, res);
                myFollowedUsers.push(user);
            }
            
    
            doRender(req, res, next, myProfile, myWatchlist, myFollowedUsers, myFollowedPeople);
        } catch(error){
            res.status(404).send("404 Error");
        }
    } else {
        return res.redirect("/signin");
    }  
});

profileRotuer.post("/"), async (req, res, next) => {
    console.log("Contributor Button Pressed.")
}

//function that queries the id for the passed query, using promises ensures that we can wait for the end of the function
//i is var to look at (ex. _id), q is query
function find (coll,i,q, res) {
    return new Promise((resolve, reject) => {
        let query = {};
        query[i] = q;
        db.collection(coll).findOne(query,function(err, result){
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
async function doRender(req, res, next, myProfile, myWatchlist, myFollowedUsers, myFollowedPeople){
    let reviews = [];
    for(var i = 0; i < myProfile.reviews.length; i++) {
        let r = await find("reviews","_id",myProfile.reviews[i],res);
        reviews.push(r);
    }
    res.render("pages/profile", {myProfile, myWatchlist, myFollowedPeople, myFollowedUsers, reviews}); 
}

module.exports = profileRotuer;