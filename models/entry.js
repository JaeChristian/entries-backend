const mongoose = require("mongoose");

// Settings entry schema
const entrySchema = new mongoose.Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model("entries", entrySchema);