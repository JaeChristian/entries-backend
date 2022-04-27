const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true
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