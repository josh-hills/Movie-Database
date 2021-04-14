const express = require('express');
const mongoose = require("mongoose");
const Review = require("../models/ReviewModel");
const reviewRouter = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;

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
                res.render("/movie?id="+movid);
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

module.exports = reviewRouter;