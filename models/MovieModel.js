const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { nanoid } = require('nanoid');
const Person = require("./PersonModel.js");

let movieSchema = Schema({
    _id: {type: String,},
    title: String,
    year: Number,
    rated: String,
    released: String,
    runtime: String,
    genre: [String],
    director: [{type: String}],
    writer: [{type: String}],
    actor: [{type: String}],
    plot: String,
    awards: String,
    poster: String
});

module.exports = mongoose.model("Movie", movieSchema);
