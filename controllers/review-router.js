const express = require('express');
const mongoose = require("mongoose");
const Review = require("../models/ReviewModel");
const reviewRouter = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;

reviewRouter.get("/", async (req, res, next)=>{
    let id;
    try{
        let un = req.session.username;
        id = req.query.id;
        let myReview = await find("reviews", "_id", id, res);
        let u = await find("users", "username", myReview.user, res);
        let m = await find("movies", "_id", myReview.movie, res);
        doRender(req, res, next, myReview, m , u);
    } catch(e){
        res.status(404).send("404 Error");
    }
});

reviewRouter.post("/", async (req, res, next)=> {
    try{
        console.log(req.body);
        let un = req.session.username;
        let sum = req.body.summary;
        let fr = req.body.fullReview;
        let rate = req.body.rating;
        let movid = req.query.id;
        let r = new Review({movie:movid, rating: rate, summary: sum, fullReview: fr, user:un});
        await r.save(async function(err, callback){
            if(err){
                console.log(err.message);
                res.render("/movie?id="+movid);
            }else{
                //review created
                let reviewID = r.id;
                let u = await find("users", "username", un, res);
                let m = await find("movies", "_id", movid, res);
                let userReviewArr = u.reviews;
                let movReviewArr = m.reviews;
                userReviewArr.push(reviewID);
                movReviewArr.push(reviewID);
                await db.collection("users").updateOne(
                    {username:un},
                    {
                        $set:{"reviews":userReviewArr}
                    }
                );
                await db.collection("movies").updateOne(
                    {_id:movid},
                    {
                        $set:{"reviews":movReviewArr}
                    }
                );
                for(let i = 0; i < u.followers.length; i++){
                    let followerUsername = u.followers[i].username;
                    console.log(followerUsername);
                    let follower = await find("users", "username", followerUsername, res);
                    let newNoti = {"user":un, "reviewID":reviewID};
                    currNoti = follower.notifications;
                    currNoti.push(newNoti);
                    await db.collection("users").updateOne(
                        {username:followerUsername},
                        {
                            $set:{"notifications":currNoti}
                        }
                    );
                }
                doRender(req, res, next, r, m ,u);
            }
        })
    } catch(err) {
        
    }
        
});


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

async function doRender(req,res,next,myReview, myMovie, myUser){
    res.render("pages/review", {myReview, myMovie, myUser});
}

module.exports = reviewRouter;