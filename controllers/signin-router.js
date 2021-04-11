const express = require('express');
const mongoose = require("mongoose");
const signinRouter = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;


//Create router
signinRouter.get("/", async (req, res, next)=> {
    res.render("pages/signin");
});

module.exports = signinRouter;