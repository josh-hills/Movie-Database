const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { nanoid } = require('nanoid');

let reviewSchema = Schema({
    _id: {
        type: String,
        default: () => nanoid()
    },
    movie: String,
    rating: Number,
    summary: String,
    fullReview: String,
    user: String
});

module.exports = mongoose.model("Review", reviewSchema);