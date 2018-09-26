var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
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

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;