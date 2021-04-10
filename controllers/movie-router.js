const express = require('express');
const mongoose = require("mongoose");
const movieRouter = express.Router();
mongoose.connect('mongodb://localhost/movies', {useNewUrlParser: true});
let db = mongoose.connection;


//Create router
//if you wanna test this, go grab any valid id and paste it for the id param in find
movieRouter.get("/", async (req, res, next)=> {
    let id;
	try{
		id = req.query.id;
        console.log(id);
        let mov = await find(id);
        doRender(req, res, next, mov);
	}catch{
		res.status(404).send("Unknown ID");
		return;
	}


});


function find (query) {
    return new Promise((resolve, reject) => {
        db.collection("movies").findOne({_id:query},function(err, result){
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

async function doRender(req, res, next, myMovie){
    res.render("pages/movie", {myMovie}); 
}


module.exports = movieRouter;