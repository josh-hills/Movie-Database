const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
    username: String,
    password: String,
    contributer: Boolean,
    followedPeople: [],
    followedUsers: [],
    watchlist: []
});

module.exports = mongoose.model("User", userSchema);