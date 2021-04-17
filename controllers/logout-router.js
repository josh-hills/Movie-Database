const express = require('express');
const mongoose = require("mongoose");
const app = require('../server');
const logoutRouter = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;

logoutRouter.post("/", async (req, res, next)=> {
    req.session.loggedin = false;
    req.session.username = null;
    res.redirect("/profile");
});

module.exports = logoutRouter;