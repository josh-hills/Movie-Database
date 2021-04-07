
const mongoose = require('mongoose');
const Movie = require("./MovieModel.js");
const fs = require("fs");
const csv = require('csv-parser')
const results = []

mongoose.connect('mongodb://localhost/movies', {useNewUrlParser: true});
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
		console.log("Dropped movie database. Starting re-creation.");

        //modify the "movie-data-____.json below to change the number of movies in the database"
		let movies = JSON.parse(fs.readFileSync("movie-data-10.json"));
		let totalmovies = movies.length;
		let finishedmovies = 0;
		let countFail = 0;
		let countSuccess = 0;	
		movies.forEach(movie => {
			let m = new Movie(movie);
			m.save(function(err, callback){
				finishedmovies++;
				if(err){
					countFail++;
					console.log(err.message);
				}else{
					countSuccess++;
				}

				if(finishedmovies == totalmovies){
					mongoose.connection.close();
					console.log("Finished.");
					console.log("Successfully added: " + countSuccess);
					console.log("Failed: " + countFail);
					process.exit(0);
				}
			});
		});
	});
});
