const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));
app.use("/songs", express.static(path.join(__dirname, "songs")));


// 📂 Get all playlists with cover, title, and description
app.get("/playlists", (req, res) => {
    const songsPath = path.join(__dirname, "songs");

    fs.readdir(songsPath, (err, files) => {
        if (err) return res.status(500).json({ error: "Error reading playlists" });

        const playlists = files
            .filter(file => fs.lstatSync(path.join(songsPath, file)).isDirectory())
            .map(playlist => {
                const infoPath = path.join(songsPath, playlist, "info.json");
                const coverPath = fs.existsSync(path.join(songsPath, playlist, "cover.jpg"))
                    ? `/songs/${encodeURIComponent(playlist)}/cover.jpg`
                    : "/default-cover.jpg"; // Use a default cover if missing

                let info = { title: playlist, description: "No description available" };

                if (fs.existsSync(infoPath)) {
                    try {
                        const data = fs.readFileSync(infoPath, "utf-8");
                        info = JSON.parse(data);
                    } catch (error) {
                        console.error(`Error reading info.json for ${playlist}:`, error);
                    }
                }

                return {
                    name: playlist,
                    title: info.title || playlist,
                    description: info.description || "No description available",
                    cover: coverPath
                };
            });

        res.json(playlists);
    });
});


// 🎵 Get all songs from a specific playlist
app.get("/playlists/:playlist", (req, res) => {
    const playlistName = req.params.playlist;
    const playlistPath = path.join(__dirname, "songs", playlistName);

    if (!fs.existsSync(playlistPath)) {
        return res.status(404).json({ error: `Playlist not found: ${playlistName}` });
    }

    fs.readdir(playlistPath, (err, files) => {
        if (err) {
            console.error(`Error reading songs for ${playlistName}:`, err);
            return res.status(500).json({ error: "Error reading songs" });
        }

        const songs = files.filter(file => file.endsWith(".mp3"));
        if (songs.length === 0) {
            return res.status(404).json({ error: "No songs found in this playlist" });
        }

        res.json(songs);
    });
});
