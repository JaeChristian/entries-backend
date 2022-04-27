const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// JWT secret variables for verification
const JWT_SECRET = "a;lfjghse;flgjsdfg';srlkgjhdtokhndfg;lghjkhsdfglksdjfhgsledfkgjh@slkdfjgh";

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

module.exports = jwtAuthentication;