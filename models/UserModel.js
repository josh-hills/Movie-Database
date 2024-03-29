const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
    username: String,
    password: String,
    contributer: false,
    reviews:[],
    followedPeople: [],
    followedUsers: [],
    watchlist: [],
    followers:[],
    writer: [{type:String}],
    notifications:[]
});

module.exports = mongoose.model("User", userSchema);