const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

// express app
const app = express();

// environmental port
const PORT = process.env.PORT || 8080;
//
// connect to MongoDB
const dbURI = "mongodb+srv://jay:december15@diaryappcluster.ptgwb.mongodb.net/diary-app?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((res) => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.log(err));
const db = mongoose.connection;
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Connected to Database"))

app.use(express.json({limit: "50mb"}));
app.use(cors());

//Route handling for entries
const entriesRouter = require("./communication/entries");
app.use("/entries", entriesRouter);

const categoriesRouter = require("./communication/categories");
app.use("/categories", categoriesRouter);

const usersRouter = require("./communication/users");
app.use("/users", usersRouter);

const loginRouter = require("./communication/login");
app.use("/login", loginRouter);