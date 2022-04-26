const express = require("express");
const mongoose = require("mongoose");

// express app
const app = express();

// environmental port
const PORT = process.env.PORT || 8080;

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

app.use(express.json());

//Route handling for entries
const entriesRouter = require("./routes/entries");
app.use('/entries', entriesRouter);