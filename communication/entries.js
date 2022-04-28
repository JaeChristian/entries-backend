const express = require("express");
const router = express.Router();
const Entry = require("../models/entry");
const jwtAuthentication = require("../validation/jwtAuthentication");

/**
 * TODO: 
 * - implement JWT for delete and update post   
 */

// Getting all
router.get("/", jwtAuthentication, async (req, res) => {
    try {
        // Uses mongo db in an async manner
        const entries = await Entry.find();
        // Send entries json with response
        res.json(entries);
    } catch (err) {

        // Return with a 500 server error
        res.status(500).json({message: err.message})
    }
});

// Getting all entries from a user
router.get("/user/:userId", jwtAuthentication, async (req, res) => {
    try {
        const userId = req.params.userId
        // Uses mongo db in an async manner
        const entries = await Entry.find({userId: userId});
        // Send entries json with response
        res.json(entries);
    } catch (err) {

        // Return with a 500 server error
        res.status(500).json({message: err.message})
    }
});

// Getting one
router.get("/:id", getEntry, (req, res, next) => {
    // res.entry is available because of getEntry middleware
    res.json(res.entry);
});

// Creating one
router.post("/", jwtAuthentication, async (req, res) => {
    // Creates new Entry object with request params
    const entry = new Entry({
        userId: res.authUser.id,
        body: req.body.body,
        title: req.body.title
    });
    try {
        // Saves to the db in async then returns the new entry
        const newEntry = await entry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        //Throws a 400 error because errors here are client-side
        res.status(400).json( {message: err.message} )
    }
});

// Updating one
router.patch("/:id", getEntry, jwtAuthentication, async (req, res) => {
    // Makes sure that only non-null parameters are saved
    if (req.body.title != null) {
        res.entry.title = req.body.title;
    } 
    if (req.body.body != null) {
        res.entry.body = req.body.body;
    } 
    if (res.authUser.id != res.entry.userId) {
        return res.status(401).json({message: "unauthorized to update this post"});
    }
    try {
        // Await on entry save
        const updatedEntry = await res.entry.save();
        res.json(updatedEntry);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Deleting one
router.delete("/:id", getEntry, async (req, res) => {
    try {
        await res.entry.remove();
        res.json({message: "deleted entry"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

// Async middleware to find entry by id
async function getEntry(req, res, next) {
    let entry
    try {
        //Finds the required entry using the Entry schema
        entry = await Entry.findById(req.params.id);
        if (entry == null) {
            //If entry is not found, return is used to immediately leave function
            return res.status(404).json({message: "Cannot find entry."})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    // Adds entry object to res for easy access in API routes
    // because middleware
    res.entry = entry;
    next();
}

module.exports = router;