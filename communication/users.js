const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwtAuthentication = require("../validation/jwtAuthentication");

// Salt used for generating JWT
const salt = 10

// Get all
router.get("/", jwtAuthentication, async (req, res) => {
    try {
        // Find all users and send it in response
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Get one
router.get("/:id", getUser, async (req, res) => {
    res.json(res.user);
});

// Create one
router.post("/", async (req, res) => {
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: password,
        visibility: 0
    });
    
    try {
        if(req.body.password.length < 6)
            throw {message: "Password length must be more than or equal to 6"};
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Update one
router.patch("/:id", getUser, jwtAuthentication, async (req, res) => {
    // If value in the request is null, it will not be updated
    if(req.body.email != null) {
        res.user.email = req.body.email;
    }
    if(req.body.username != null) {
        res.user.username = req.body.username;
    }
    if(req.body.password != null) {
        // Encrypt new password
        const password = await bcrypt.hash(req.body.password, salt);
        res.user.password = password
    }
    if(req.body.visibility != null) {
        res.user.visibility = req.body.visibility;
    }

    try {
        // If password is less than 6, throw error
        if(req.body.password?.length < 6)
            throw {message: "Password length must be more than or equal to 6"}
        // If id does not match, throw error
        if(res.authUser.id != res.user.id) {
            return res.status(401).json({message: "unauthorized to update this user"});
        }
        // Save updated user and send it with the response
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Delete one

// Middleware that gets the user and saves it in res.user
async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if(user == null) {
            return res.status(404).json({message: "Cannot find user"});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.user = user;
    next();
}

module.exports = router;