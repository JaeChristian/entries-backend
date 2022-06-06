const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    username: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        default: false,
        required: true
    },
    bio: {
        type: String
    },
    profileImageURL: {
        type: String,
        default: "http://res.cloudinary.com/izuchuku/image/upload/v1654473692/entries/xbg1fv86olvhu8mhyggi.jpg"

    }
});

module.exports = mongoose.model("users", userSchema);