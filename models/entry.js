const mongoose = require("mongoose");
const uuid = require("uuid");

//Allows node to interact with the entries schema

// Settings entry schema
const entrySchema = new mongoose.Schema({
    title: {
        type: String
    },
    body: {

    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model("entries", entrySchema);