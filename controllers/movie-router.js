const express = require('express');
const mongoose = require("mongoose");
const movieRouter = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;


//Create router
//if you wanna test this, go grab any valid id and paste it for the id param in find
movieRouter.get("/", async (req, res, next)=> {
    let id;
    let simMovies = [];
	try{
		id = req.query.id;
        let mov = await find("movies","_id",id,res);

        //Get This movie's genre
        let curMovGenre = mov.genre;
        
        //for each genre
        for(let i = 0; i < curMovGenre.length; i++){

            db.collection("movies").find(
                {
                    $and:
                        [{genre:curMovGenre[i]},
                        {title: {$ne: mov.title}}]
                }).toArray( function(err, results){
                    if (err){
                        res.status(500).send("Error Reading Database for similar movies.");
                        return;
                    }
                    for(let j = 0; j < results.length; j++){
                        simMovies.push(results[j])
                        if(simMovies.length > 5){
                            simMovies.shift();
                        }
                    }
                });
        }
        
        simMovies.slice(0, 5);
       
        doRender(req, res, next, mov, simMovies);
	}catch{
		res.status(404).send("Unknown ID");
		return;
	}
});

movieRouter.post("/", async (req, res, next)=> {
    myProfile = await find("users","username",req.session.username, res);
    let mov = await find("movies","_id",req.query.id,res);
    let curMovGenre = mov.genre;
    let simMovies = [];
    for(let i = 0; i < curMovGenre.length; i++){

        db.collection("movies").find(
            {
                $and:
                    [{genre:curMovGenre[i]},
                    {title: {$ne: mov.title}}]
            }).toArray( function(err, results){
                if (err){
                    res.status(500).send("Error Reading Database for similar movies.");
                    return;
                }
                for(let j = 0; j < results.length; j++){
                    simMovies.push(results[j])
                    if(simMovies.length > 5){
                        simMovies.shift();
                    }
                }
            });
    }
    
    simMovies.slice(0,5);

    if(req.body.unfollow){   
        for(var i = 0; i < myProfile.watchlist.length; i++) {
            if (myProfile.watchlist[i].id == req.query.id) {
                myProfile.watchlist.splice(i, 1);
                await db.collection("users").updateOne(
                    {username:myProfile.username},
                    {
                        $set:{"watchlist":myProfile.watchlist}
                    }
                );
            }
        }
    

        doRender(req, res, next, mov, simMovies);
    }else if(req.body.follow){
        let query = {};
        query["id"] = req.query.id;
        myProfile.watchlist.push(query);
        await db.collection("users").updateOne(
            {username:myProfile.username},
            {
                $set:{"watchlist":myProfile.watchlist}
            }
        );
        doRender(req, res, next, mov, simMovies);
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
                res.status(404).send("Unknown ID");
                return;
            }
            resolve(result);
        })
    });
}

//renders movie page
async function doRender(req, res, next, myMovie, simMovies){
    let myProfile = [];
    let actors = [];
    let directors = [];
    let writers = [];
    let reviews = [];
    let following;
    let loggedin = req.session.loggedin;

    if(loggedin){
        following = false;
        myProfile = await find("users","username",req.session.username, res);
        for(var i = 0; i < myProfile.watchlist.length; i++) {
            if (myProfile.watchlist[i].id == myMovie._id) {
                following = true;
            }
        }
    }
    for(var i = 0; i < myMovie.director.length; i++) {
        let d = await find("people","_id",myMovie.director[i],res);
        directors.push(d);
    }
    for(var i = 0; i < myMovie.reviews.length; i++) {
        let r = await find("reviews","_id",myMovie.reviews[i],res);
        reviews.push(r);
    }
    for(var i = 0; i < myMovie.actor.length; i++) {
        let d = await find("people","_id",myMovie.actor[i],res);
        actors.push(d);
    }
    for(var i = 0; i < myMovie.writer.length; i++) {
        let d = await find("people","_id",myMovie.writer[i],res);
        writers.push(d);
    }

    res.render("pages/movie", {myMovie,myProfile,following,directors,actors,writers,reviews,loggedin, simMovies}); 
}


module.exports = movieRouter;