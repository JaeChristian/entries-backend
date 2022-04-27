const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Secret token for signing and verifying JWT
const JWT_SECRET = "a;lfjghse;flgjsdfg';srlkgjhdtokhndfg;lghjkhsdfglksdjfhgsledfkgjh@slkdfjgh";

router.post("/", async (req, res) => {
    let user;
    try {
        // Get user object from the database using the username
        user = await User.findOne({username: req.body.username}).lean();
        // Bcrypt compare requested password to the real users password
        if(await bcrypt.compare(req.body.password, user.password)){
            const token = jwt.sign({
                id: user._id, username: user.username
            }, JWT_SECRET);
            return res.json({valid: true, token: token});
        } 

        // If the return didn't happen, throw error
        throw err;
    } catch (err) {
        res.status(400).json({message: "invalid username/password"});
    }
});

module.exports = router;