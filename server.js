const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// ✅ Allow requests from your frontend
const allowedOrigins = ["https://spotify-clone-v123.vercel.app"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.use(express.static("public"));
app.use("/songs", express.static(path.join(__dirname, "songs")));

// 📂 Get all playlists with cover, title, and description
app.get("/playlists", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");  // Explicitly set CORS headers
    const songsPath = path.join(__dirname, "songs");

    fs.readdir(songsPath, (err, files) => {
        if (err) return res.status(500).json({ error: "Error reading playlists" });

        const playlists = files
            .filter(file => fs.lstatSync(path.join(songsPath, file)).isDirectory())
            .map(playlist => {
                const infoPath = path.join(songsPath, playlist, "info.json");
                const coverPath = `/songs/${encodeURIComponent(playlist)}/cover.jpg`;

                let info = { title: playlist, description: "No description available" };

                if (fs.existsSync(infoPath)) {
                    const data = fs.readFileSync(infoPath, "utf-8");
                    info = JSON.parse(data);
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
    res.setHeader("Access-Control-Allow-Origin", "*");  // Explicitly allow cross-origin
    const playlistName = req.params.playlist;
    const playlistPath = path.join(__dirname, "songs", playlistName);

    if (!fs.existsSync(playlistPath)) {
        return res.status(404).json({ error: `Playlist not found: ${playlistName}` });
    }

    fs.readdir(playlistPath, (err, files) => {
        if (err) return res.status(500).json({ error: "Error reading songs" });

        const songs = files.filter(file => file.endsWith(".mp3"));
        if (songs.length === 0) {
            return res.status(404).json({ error: "No songs found in this playlist" });
        }

        res.json(songs);
    });
});

// ✅ CORS Preflight Handling for All Routes
app.options("*", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
