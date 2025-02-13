const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));

// Serve songs from all playlists
app.use("/songs", express.static(path.join(__dirname, "songs")));

// 📂 Get all playlists (folders inside /songs)
app.get("/playlists", (req, res) => {
    const songsPath = path.join(__dirname, "songs");
    fs.readdir(songsPath, (err, files) => {
        if (err) return res.status(500).json({ error: "Error reading playlists" });

        const playlists = files.filter(file => fs.lstatSync(path.join(songsPath, file)).isDirectory());
        res.json(playlists);
    });
});

// 🎵 Get all songs from a specific playlist
app.get("/playlists/:playlist", (req, res) => {
    const playlistName = req.params.playlist;
    const playlistPath = path.join(__dirname, "songs", playlistName);

    fs.readdir(playlistPath, (err, files) => {
        if (err) return res.status(500).json({ error: "Error reading songs" });

        const songs = files.filter(file => file.endsWith(".mp3"));
        res.json(songs);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
