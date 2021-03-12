const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "pug");

app.use(express.static(__dirname + "/public"));

//render homepage
app.get("/", (req, res, next)=> { res.render("pages/index"); });

//render profile page
app.get("/profile", (req, res, next)=> {
    let myProfile = require("./me.json")
    res.render("pages/profile", {myProfile}); 
});

//render otherUsers page, triggered by clicking a user under "Followed Users", this checks if the user is contained in your followedUsers, changes follow button accordingly
app.get("/otheruser", (req, res, next)=> {
    let myProfile = require("./me.json")
    let userProfile = require("./otheruser.json")
    let followsUser = myProfile.followedUsers.some(user => user.name == userProfile.name);
    console.log(followsUser);
    res.render("pages/otheruser", {userProfile, followsUser}); 
});

//render sign in page
app.get("/signin", (req, res, next)=> { res.render("pages/signin"); });

//render search page
app.get("/search", (req, res, next)=> { res.render("pages/search"); });

//render contribuation page
app.get("/contribute", (req, res, next)=> { res.render("pages/contribute"); });


app.listen(port);
console.log("Server listening at http://localhost:3000");

