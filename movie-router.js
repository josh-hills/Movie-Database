const express = require('express');
const path = require('path');
const fs = require("fs");
const movieRouter = express.Router();

//Create router
movieRouter.get("/movie", (req, res, next)=> {
    let myProfile = require("./me.json")
    // let myMovie = myProfile.watchlist[3];
    // res.render("pages/movie", {myMovie}); 
    res.render("pages/index");
});

module.exports = movieRouter;