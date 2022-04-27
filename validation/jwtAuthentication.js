const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// JWT secret variables for verification
const JWT_SECRET = "a;lfjghse;flgjsdfg';srlkgjhdtokhndfg;lghjkhsdfglksdjfhgsledfkgjh@slkdfjgh";

// Middleware filter for handling JWT authentication.
// Returns a verified user's information to next middleware as res.authUser.
async function jwtAuthentication(req, res, next) {
    let authUser;
    try {
        const {token} = req.body;
        authUser = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({message: err.message});
    }

    //Saves the authenticated user information to res.authUser
    res.authUser = authUser;
    next();
}

module.exports = jwtAuthentication;