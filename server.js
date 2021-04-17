const express = require("express");
const bp = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

let logoutController = require("./controllers/logout-router");
let movieController = require("./controllers/movie-router");
let profileController = require("./controllers/profile-router");
let signinController = require("./controllers/signin-router");
let searchController = require("./controllers/search-router");
let userController = require("./controllers/user-router");
let contributionController = require("./controllers/contribution-router");
let personController = require("./controllers/person-router");
let reviewController = require("./controllers/review-router");
let indexController = require("./controllers/index-router")
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
app.use("/logout", logoutController);
app.use("/movie", movieController);
app.use("/signin", signinController);
app.use("/profile", profileController);
app.use("/search", searchController);
app.use("/user", userController);
app.use("/contribute", contributionController);
app.use("/person", personController);
app.use("/review", reviewController);
app.use("/index", indexController);


app.listen(port);
console.log("Server listening at http://localhost:27017");
module.exports = app;