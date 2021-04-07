const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let movieSchema = Schema({
    Title: String,
    Year: Number,
    Rated: String,
    Released: String,
    Runtime: String,
    Genre: [String],
    Director: [String],
    Writer: [String],
    Actors: [String],
    Plot: String,
    Awards: String,
    Poster: String
});

module.exports = mongoose.model("Movie", movieSchema);
