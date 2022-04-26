const express = require("express");
const router = express.Router();
const Category = require("../models/category");

// Getting all
router.get("/", async (req, res) => {
    try {
        //Stores all categories
        const categories = await Category.find();
        //Sends a json with the response
        res.json(categories);
    } catch (err) {
        //Return with 500 server error with error json
        res.status(500).json({message: err.message});
    }
});
// Getting all by userId

// Getting one by _id

// Creating one
router.post("/", async (req, res) => {
    // Initializing new category object
    const category = new Category({
        userId: req.body.userId,
        name: req.body.name
    });

    try {
        // Saving new category to mongodb
        const newCategory = await category.save();
        // Sends a json with status code 201 with the response
        res.status(201).json(newCategory);
    } catch (err){
        res.status(400).json({message: err.message});
    }
});

// Updating one

// Deleting one
module.exports = router;