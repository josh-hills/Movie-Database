const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Movie = require("./MovieModel.js");

let personSchema = Schema({
    _id: {type: String},
    name: String,
    director: [{type:String}],
    actor: [{type:String}],
    writer: [{type:String}],
    followers: [{type:String}]
});

module.exports = mongoose.model("Person", personSchema);