const mongoose =  require("mongoose");

const commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

let comment = mongoose.model("Comment", commentSchema);

module.exports = comment;