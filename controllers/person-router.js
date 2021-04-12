const express = require('express');
const mongoose = require("mongoose");
const personRouter = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;


//Create router
personRouter.get("/", async (req, res, next)=> {
    let id;
	try{
		id = req.query.id;
        let person = await find("people","_id",id,res);
        doRender(req, res, next, person);
	}catch{
		res.status(404).send("Unknown ID");
		return;
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
                res.status(404).send("Unknown ID 2");
                return;
            }
            resolve(result);
        })
    });
}


async function doRender(req, res, next, person){
    let following;
    let actors = [];
    let directors = [];
    let writers = [];
    if(req.session.loggedin){
        following = false;
        myProfile = await find("users","username",req.session.username, res);
        for(var i = 0; i < myProfile.followedPeople.length; i++) {
            if (myProfile.followedPeople[i]._id == person._id) {
                following = true;
            }
        }
    }
    for(var i = 0; i < person.director.length; i++) {
        let d = await find("people","_id",person.director[i],res);
        directors.push(d);
    }
    for(var i = 0; i < person.actor.length; i++) {
        let d = await find("people","_id",person.actor[i],res);
        actors.push(d);
    }
    for(var i = 0; i < person.writer.length; i++) {
        let d = await find("people","_id",person.writer[i],res);
        writers.push(d);
    }
    res.render("pages/person", {person,myProfile,following,directors,actors,writers}); 
}

module.exports = personRouter;