const express = require("express");
const { update } = require("../models/category");
const router = express.Router();
const Category = require("../models/category");
const jwtAuthentication = require("../validation/jwtAuthentication");

/**
 * Todo:
 * - Implement security for get one endpoint
 */

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

// Getting all categories by userId
router.get("/user/:userId", jwtAuthentication, async (req, res) => {
    try {
        //Getting userId from url
        const userId = req.params.userId
        //If jwt user does not match userId -> unauthorized
        if(res.authUser.id != userId) {
            return res.status(401).json({message: "unauthorized"});
        }
        // Find category
        const categories = await Category.find({userId: userId});
        // Send entries json with response
        res.json(categories);
    } catch (err) {
        // Return with a 500 server error
        res.status(500).json({message: err.message})
    }
});

// Getting one by _id
router.get("/:id", getCategory, async (req, res) => {
    res.json(res.category);
});

// Creating one
router.post("/", jwtAuthentication, async (req, res) => {
    // Initializing new category object
    const category = new Category({
        userId: res.authUser.id,
        name: req.body.name
    });
    
    try {
        // Saving new category to mongodb
        const newCategory = await category.save();
        // Sends a json with status code 201 with the response
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Updating one
router.patch("/:id", getCategory, jwtAuthentication, async (req, res) => {
    try {
        // Security validation
        if(res.authUser.id != res.category.userId) {
            return res.status(401).json({message: "unauthorized"});
        }

        // Only change what is not null
        if(req.body.name != null) {
            res.category.name = req.body.name;
        }

        const updatedCategory = await res.category.save();
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Deleting one
router.delete("/:id", getCategory, jwtAuthentication, async (req, res) => {
    try {
        // Security validation
        if(res.authUser.id != res.category.userId) {
            return res.status(401).json({message: "unauthorized"});
        }

        const deletedCategory = await res.category.delete();
        res.json(deletedCategory);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

async function getCategory(req, res, next) {
    let category;
    try {
        category = await Category.findById(req.params.id);
        if (category == null) {
            return res.status(404).json({message: `Cannot find category of id ${req.params.id}`});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.category = category;
    next();
}

module.exports = router;