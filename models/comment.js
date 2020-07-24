const mongoose =  require("mongoose");

const commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

let comment = mongoose.model("Comment", commentSchema);

module.exports = comment;