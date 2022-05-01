const mongoose = require("mongoose");

// Settings entry schema
const entrySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    categoryId: {
        type: String,
        default: ""
    },
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