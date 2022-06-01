const express = require("express");
const router = express.Router();
const Entry = require("../models/entry");
const {cloudinary} = require("../models/cloudinary");
const jwtAuthentication = require("../validation/jwtAuthentication");

/**
 * Todo:
 * - Implement security for get one endpoint
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
    let imageURL = null;
    // If the image exists, then upload it to cloudinary
    if(req.body.image != null) {
        const fileStr = req.body.image;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {upload_preset: "entries"});
        //console.log(uploadedResponse);
        imageURL = uploadedResponse.url;
    }

    // Creates new Entry object with request params
    let entry = new Entry({
        userId: res.authUser.id,
        body: req.body.body,
        title: req.body.title,
        imageURL: imageURL
    });

    // Checks if a category Id is included
    if (req.body.categoryId != null) {
        entry.categoryId = req.body.categoryId;
    }

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
    if (req.body.categoryId != null) {
        res.entry.categoryId = req.body.categoryId;
    }
    if (req.body.color != null) {
        res.entry.color = req.body.color;
    }

    // If an imageURL is sent as "" then nullify the current imageURL 
    if(req.body.imageURL == "") {
        res.entry.imageURL = null;
    }

    //If an image string is sent then upload a new image and set a new URL
    if (req.body.image != null) {
        const fileStr = req.body.image;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {upload_preset: "entries"});
        //console.log(uploadedResponse);
        imageURL = uploadedResponse.url;
        res.entry.imageURL = uploadedResponse.url;
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
router.delete("/:id", getEntry, jwtAuthentication, async (req, res) => {
    try {
        if(res.authUser.id != res.entry.userId)
            return res.status(401).json({message: "unauthorized to delete this post"});
        const deletedEntry = await res.entry.remove();
        res.json(deletedEntry)
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
        return res.status(500).json({message: err.message});
    }

    // Adds entry object to res for easy access in API routes
    // because middleware
    res.entry = entry;
    next();
}

module.exports = router;