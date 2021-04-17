const fileName = "./movieData/movie-data-2500.json";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Movie = require("./models/MovieModel.js");
const Person = require("./models/PersonModel.js");
const { nanoid } = require('nanoid');

//Array of all movie documents (no duplicates)
let allMovies = []; 
//Object to find people by name easier than using array (works since people names are assumed unique)
let people = {};
//Array of all people documents (no duplicates)
//(this is only used so we don't have to iterate over the people object later)
let allPeople = [];


function addPersonToMovie(personName, movie, position){
  //If our people object does not contain this name (i.e., this is a new person)
  if(!people.hasOwnProperty(personName)){
    //Create a new Person document, set initial state
    let newPerson = new Person();
    
    //This is a key piece of functionality
    //We can use Mongoose to generate ObjectIDs OUTSIDE of the database
    //So we can use these IDs before we have actually inserted anything    
    newPerson._id = nanoid();

    newPerson.name = personName;
    newPerson.director = [];
    newPerson.actor = [];
    newPerson.writer = [];
    newPerson.followers = [];
    //Add new Person document to our array of all people
    allPeople.push(newPerson);
    //Update the people object (name -> person document)
    people[newPerson.name] = newPerson;
  }
  
  //At this point, we know the movie and person are defined documents
  //Retrieve the current person using their name, update the movie and person
  let curPerson = people[personName];
  curPerson[position].push(movie._id);
  movie[position].push(curPerson._id);
}

//Read the JSON data provided in the given file
//This is an array of objects representing movies
let data = require(fileName);
data.forEach(movie=>{
  let newMovie = new Movie();
  newMovie._id = nanoid();
  newMovie.title = movie.Title;
  newMovie.year = movie.year;
  newMovie.runtime = movie.Runtime;
  newMovie.genre = movie.Genre;
  newMovie.plot = movie.Plot;
  newMovie.rated = movie.Rated;
  newMovie.plot = movie.Plot;
  newMovie.awards = movie.Awards;
  newMovie.poster = movie.Poster
  
  movie.Actors.forEach(actorName => {
    addPersonToMovie(actorName, newMovie, "actor");
  })
  
  //Repeat for directors
  movie.Director.forEach(directorName => {
    addPersonToMovie(directorName, newMovie, "director");
  })
  
  //Repeast for writers
  movie.Writer.forEach(directorName => {
    addPersonToMovie(directorName, newMovie, "writer");
  })
  
  //Add the movie to our array of all movies (these are added to the database once we are finished)
  allMovies.push(newMovie)
})


mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //We are connected. Drop the database first so we start fresh each time.
  mongoose.connection.db.dropDatabase(function(err, result){

    //Add all of the movie documents to the database
    Movie.insertMany(allMovies, function(err, result){
  	  if(err){
  		  console.log(err);
  		  return;
  	  }
  	  
      //Add all of the people documents to the database
      Person.insertMany(allPeople, function(err, result){
    	  if(err){
    		  console.log(err);
    		  return;
    	  }

        Movie.findOne({title: "Toy Story"}).populate("director actor writer").exec(function(err, result){
          if(err)throw err;
          
          Person.findOne({name: "Tom Hanks"}).populate("actor director writer").exec(function(err, result){
            if(err)throw err;
            console.log("Database initialized")
            mongoose.connection.close()
          })
        })
      });
    });
  });
});