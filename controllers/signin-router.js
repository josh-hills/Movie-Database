const express = require('express');
const mongoose = require("mongoose");
const User = require("../models/UserModel");
const signinRouter = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;

//Create router
signinRouter.get("/", async (req, res, next)=> {
    res.render("pages/signin");
});

signinRouter.post("/", async (req, res, next)=> {
    searchUser(req.body.username,req.body.password);
    res.render("pages/signin");
});

//function that queries the id for the passed query, using promises ensures that we can wait for the end of the function
function searchUser(un, pass) {
    return new Promise((resolve, reject) => {
        db.collection("users").findOne({username:un},function(err, result){
            if(err){
                reject("Error reading database.");
            }else if(!result){
                //create an account with given credentials
                let u = new User({username:un, password:pass, followedPeople:[], followedUsers:[],watchlist:[]});
                u.save(function(err, callback){
                    if(err){
                        console.log(err.message);
                        reject(err);
                    }else{
                        console.log("user created");
                        resolve("user created");
                    }
                });
            }else if(result.password == pass){
                //start session, user is logged in
            } else {
                //user submitted incorrect password, try again
            }

            resolve(result);
        })
    });
}

module.exports = signinRouter;