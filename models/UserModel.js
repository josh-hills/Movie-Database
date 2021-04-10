const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
    username: String,
    password: String,
    followedPeople: [String],
    followedUsers: [String],
    watchlist: [String]
});

module.exports = mongoose.model("User", userSchema);