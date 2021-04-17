const express = require('express');
const mongoose = require("mongoose");
const userRouter = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;

//loops through the users watchlist and adds it to the userWatchlist array, this and userProfile are passed to user.pug
userRouter.get("/", async (req, res, next)=> {
    try{
        if(req.query.username == req.session.username){
            res.redirect("/profile");
        }
        let userProfile = await find("users","username",req.query.username,res);
        let userWatchlist = [];
        let userFollowedPeople = [];
        let userFollowedUsers = [];
        for(let i = 0; i < userProfile.watchlist.length; i++){
            let id = userProfile.watchlist[i].id;
            let mov = await find("movies","_id",id);
            userWatchlist.push(mov);
        }
        for(let i = 0; i < userProfile.followedPeople.length; i++){
            let pid = userProfile.followedPeople[i]._id;
            let person = await find("people","_id",pid, res);
            userFollowedPeople.push(person);
        }
        for(let i = 0; i < userProfile.followedUsers.length; i++){
            let un = userProfile.followedUsers[i].username;
            let user = await find("users","username",un, res);
            userFollowedUsers.push(user);
        }
        doRender(req, res, next, userProfile, userWatchlist, userFollowedPeople, userFollowedUsers);
    } catch(error){
        res.status(404).send("404 Error");
    }
});


userRouter.post("/", async (req, res, next)=> {
    myProfile = await find("users","username",req.session.username, res);
    let userProfile = await find("users","username",req.query.username, res);
    let userWatchlist = [];
    let userFollowedPeople = [];
    let userFollowedUsers = [];
    for(let i = 0; i < userProfile.watchlist.length; i++){
        let id = userProfile.watchlist[i].id;
        let mov = await find("movies","_id",id);
        userWatchlist.push(mov);
    }
    for(let i = 0; i < userProfile.followedPeople.length; i++){
        let pid = userProfile.followedPeople[i]._id;
        let person = await find("people","_id",pid, res);
        userFollowedPeople.push(person);
    }
    for(let i = 0; i < userProfile.followedUsers.length; i++){
        let un = userProfile.followedUsers[i].username;
        let user = await find("users","username",un, res);
        userFollowedUsers.push(user);
    }
    if(req.body.unfollow){   
        for(var i = 0; i < myProfile.followedUsers.length; i++) {
            if (myProfile.followedUsers[i].username == req.query.username) {
                myProfile.followedUsers.splice(i, 1);
                await db.collection("users").updateOne(
                    {username:myProfile.username},
                    {
                        $set:{"followedUsers":myProfile.followedUsers}
                    }
                );
            }
        }
        doRender(req, res, next, userProfile, userWatchlist, userFollowedPeople, userFollowedUsers);
    }else if(req.body.follow){
        let query = {};
        let query2 = {};
        query["username"] = req.query.username;
        query2["username"] = req.session.username;
        userProfile.followers.push(query2)
        myProfile.followedUsers.push(query);
        await db.collection("users").updateOne(
            {username:myProfile.username},
            {
                $set:{"followedUsers":myProfile.followedUsers}
            }
        );
        await db.collection("users").updateOne(
            {username:userProfile.username},
            {
                $set:{"followers":userProfile.followers}
            }
        );
        doRender(req, res, next, userProfile, userWatchlist, userFollowedPeople, userFollowedUsers);
    }
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

//renders user page
async function doRender(req, res, next, userProfile, userWatchlist, userFollowedPeople, userFollowedUsers){
    let reviews = [];
    let following;
    for(var i = 0; i < userProfile.reviews.length; i++) {
        let r = await find("reviews","_id",userProfile.reviews[i],res);
        reviews.push(r);
    }
    if(req.session.loggedin){
        following = false;
        myProfile = await find("users","username",req.session.username, res);
        for(var i = 0; i < myProfile.followedUsers.length; i++) {
            if (myProfile.followedUsers[i].username == userProfile.username) {
                following = true;
            }
        }
    }
    res.render("pages/user", {userProfile, userWatchlist, following, userFollowedPeople, userFollowedUsers, reviews}); 
}

module.exports = userRouter;