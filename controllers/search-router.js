const express = require('express');
const mongoose = require("mongoose");
const searchRouter = express.Router();
mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;


//Create router
searchRouter.get("/", async (req, res, next)=> {
    
    console.log("DATA LIST:")
    console.log(db.collection("movies").find({}))
    res.render("pages/search");
});

//function that queries the id for the passed query, using promises ensures that we can wait for the end of the function
function find (query) {
    return new Promise((resolve, reject) => {
        db.collection("movies").findOne({_id:query},function(err, result){
            if(err){
                reject("Error reading database.");
            }
            if(!result){
                reject("ID not found");
            }
            resolve(result);
        })
    });
}
module.exports = searchRouter;