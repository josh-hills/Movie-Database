const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { nanoid } = require('nanoid');

let movieSchema = Schema({
    _id: {
        type: String,
        default: ()=> nanoid()
    },
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
