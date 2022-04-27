const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT secret variables for verification
const JWT_SECRET = "a;lfjghse;flgjsdfg';srlkgjhdtokhndfg;lghjkhsdfglksdjfhgsledfkgjh@slkdfjgh";
// Salt used for generating JWT
const salt = 10

// Get all
router.get("/", async (req, res) => {
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
            throw {message: "You are not authenticated to edit this user"}
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

// Middleware that handles jwt authentication and saves the decrypted jwt to res.authUser
async function jwtAuthentication(req, res, next) {
    let authUser;
    try {
        const {token} = req.body;
        authUser = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({message: err.message});
    }

    res.authUser = authUser;
    next();
}

module.exports = router;