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
        let myRecommendations = [];
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

            //Recommendation: 
            /*Recommendation critera will be up to the first 5 movies that the people
            in their followed list have been a part of. If the first person has contributed
            to 2 movies, those 2 movies will be listed, and if there are more people followed,
            the movie contributions of the next person will be in the recommendation as well.
            To complete this, we will grab all movies that the followed list has contributed to 
            and splice(0,5).
            */
            let recIDS = [];
            for(let i = 0; i < myProfile.followedPeople.length; i++){
                    let curPerson = myProfile.followedPeople[i]._id;
                    let person = await find("people","_id", curPerson)
                    
                    for (let j= 0; j < person.director.length; j++)
                    {
                        if (!recIDS.includes(person.director[j])){
                            recIDS.push(person.director[j])
                        }
                    }
                    for (let j= 0; j < person.writer.length; j++)
                    {
                        if (!recIDS.includes(person.writer[j])){
                            recIDS.push(person.writer[j])
                        }
                    }
                    for (let j= 0; j < person.actor.length; j++)
                    {
                        if (!recIDS.includes(person.actor[j])){
                            recIDS.push(person.actor[j])
                        }
                    }
                }
            console.log(recIDS);

            for(let i = 0; i < recIDS.length; i++){
                curMovie = recIDS[i];
                let curMovieName = await find("movies", "_id", curMovie)
                myRecommendations.push(curMovieName);
            }
            //myRecommendations.splice(0,5)
        
            
            if (myRecommendations.length > 5){
                let cur = (myRecommendations.length-5)
                myRecommendations.splice(0, cur)
            }
            console.log(myProfile.contributer);
            doRender(req, res, next, myProfile, myWatchlist, myFollowedUsers, myFollowedPeople, myRecommendations);
        } catch(error){
            res.status(404).send("404 Error");
        }
    } else {
        return res.redirect("/signin");
    }  
});

profileRotuer.post("/", async (req, res, next) => {
    
    console.log("Contributor Button Pressed.")
    let myProfile = await find("users","username",req.session.username);
    console.log(myProfile);
    let contStatus = req.body.yesNoDD;
    console.log("----------------------")
    if (contStatus == "Yes"){
        db.collection("users").update({_id: myProfile._id},{$set: {contributer: true}})
    }
    else{
        db.collection("users").update({_id: myProfile._id},{$set: {contributer: false}})
    }
    console.log(myProfile)
    res.redirect("/profile")
});

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
async function doRender(req, res, next, myProfile, myWatchlist, myFollowedUsers, myFollowedPeople, myRecommendations){
    let reviews = [];
    for(var i = 0; i < myProfile.reviews.length; i++) {
        let r = await find("reviews","_id",myProfile.reviews[i],res);
        reviews.push(r);
    }
    res.render("pages/profile", {myProfile, myWatchlist, myFollowedPeople, myFollowedUsers, reviews, myRecommendations}); 
}

module.exports = profileRotuer;