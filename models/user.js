const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema({
    _id: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String
    },
    password: {
        type: String,
        required: true
    },
    visibility: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("users", userSchema);