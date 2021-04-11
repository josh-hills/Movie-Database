const express = require("express");
const bp = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

let movieController = require("./controllers/movie-router");
let profileController = require("./controllers/profile-router");
let signinController = require("./controllers/signin-router");
let searchController = require("./controllers/search-router");
let userController = require("./controllers/user-router")

// middleware
app.use(bp.json());
app.use(bp.urlencoded({extended: true}));
app.use(session({
    secret: "407804612236324", 
    loggedin:false, 
    username:null,
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(__dirname + "/public"));


app.set("view engine", "pug");

//render homepage
app.get("/", (req, res, next)=> { 
    if(!req.session.loggedin){
        req.session.loggedin=false;
    }
    res.render("pages/index");
});


//init controllers
app.use("/movie", movieController);
app.use("/signin", signinController);
app.use("/profile", profileController);
app.use("/search", searchController);
app.use("/user", userController);


//render review page
app.get("/review", (req, res, next)=> {
    let myProfile = require("./me.json");
    let myReview = myProfile.watchlist[3].Review[0];
    res.render("pages/review", {myReview}); 
});

//render person page
app.get("/person", (req, res, next)=> {
    let myProfile = require("./me.json");
    let myPerson = myProfile.followedPeople[0];
    console.log(myPerson);
    res.render("pages/person", {myPerson}); 
});

//render contribuation page
app.get("/contribute", (req, res, next)=> { res.render("pages/contribute"); });

//render search results page
//app.get("/searchresults", (req, res, next) => {res.render("pages/searchresults"); })

app.listen(port);
console.log("Server listening at http://localhost:3000");
module.exports = app;