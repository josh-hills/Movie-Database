const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "pug");
app.get("/", (req, res, next)=> { res.render("pages/index"); });

app.get("/profile", (req, res, next)=> {
    let myProfile = require("./me.json")
    res.render("pages/profile", {myProfile}); 
});


app.get("/signin", (req, res, next)=> { res.render("pages/signin"); });

app.get("/search", (req, res, next)=> { res.render("pages/search"); });

app.get("/contribute", (req, res, next)=> { res.render("pages/contribute"); });


app.listen(port);
console.log("Server listening at http://localhost:3000");

