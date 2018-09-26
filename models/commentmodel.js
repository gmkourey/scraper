var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    note: {
        type: String,
        required: true,
        validation: [
            function(input) {
                return input.length >= 10;
            },
            "Comment needs to be at least 10 characters long"
        ] 
        
    }

})

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;