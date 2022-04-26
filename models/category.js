const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    userId: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model("categories", categorySchema);