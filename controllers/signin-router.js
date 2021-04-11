const express = require('express');
const mongoose = require("mongoose");
const User = require("../models/UserModel");
const signinRouter = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;

//Create router
signinRouter.get("/", async (req, res, next)=> {
    let loggedIn = req.session.loggedin;
    res.render("pages/signin", {loggedIn});
});

signinRouter.post("/", async (req, res, next)=> {
    let x = await searchUser(req.body.username,req.body.password, req, res, next);
    console.log(x);
    return res.redirect(x);
});

//function that queries the id for the passed query, using promises ensures that we can wait for the end of the function
function searchUser(un, pass, req, res, next) {
    return new Promise((resolve, reject) => {
        db.collection("users").findOne({username:un},function(err, result){
            if(req.session.loggedin){
                res.status(200).send("Already logged in.");
                resolve("/profile")
            }else if(err){
                reject("/signin");
            }else if(!result){
                //create an account with given credentials
                let u = new User({username:un, password:pass, followedPeople:[], followedUsers:[],watchlist:[]});
                u.save(function(err, callback){
                    if(err){
                        console.log(err.message);
                        reject("/profile");
                    }else{
                        console.log("user created");
                        req.session.loggedin = true;
                        req.session.username = un;
                        resolve("/profile");
                    }
                });
            }else if(result.password == pass){
                //login a user if password matches
                req.session.loggedin = true;
                req.session.username = un;
                console.log("user logged in:" + req.session.username);
                resolve("/profile");
            } else {
                //password didnt match, return
                resolve("/signin")
            }
        })
    });
}

module.exports = signinRouter;