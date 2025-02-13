const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Enable CORS for frontend requests
app.use(cors());

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html on root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve MP3 files from 'songs' folder
app.use("/songs", express.static(path.join(__dirname, "songs")));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
