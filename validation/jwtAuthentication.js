const express = require("express");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// JWT secret variables for verification
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware filter for handling JWT authentication. Requires a JWT token in request.
// Returns a verified user's information to next middleware as res.authUser.
async function jwtAuthentication(req, res, next) {
    let authUser;
    try {
        const token = req.headers.authorization?.split(' ')[1];
        authUser = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({message: err.message});
    }

    //Saves the authenticated user information to res.authUser
    res.authUser = authUser;
    next();
}

module.exports = jwtAuthentication;