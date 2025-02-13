const backendURL = "http://localhost:3000";
const playlistContainer = document.querySelector(".cardContainer");
const songContainer = document.querySelector(".songList ul");
const songInfo = document.querySelector(".songinfo");
const audioPlayer = new Audio();
let currentPlaylist = "";

// 🚀 Load Playlists
async function loadPlaylists() {
    playlistContainer.innerHTML = "";
    const response = await fetch(`${backendURL}/playlists`);
    const playlists = await response.json();

    playlists.forEach(playlist => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `<h3>${playlist}</h3>`;
        div.onclick = () => loadSongs(playlist);
        playlistContainer.appendChild(div);
    });
}

// 🎵 Load Songs when a Playlist is Clicked
async function loadSongs(playlist) {
    songContainer.innerHTML = "";
    currentPlaylist = playlist;

    const response = await fetch(`${backendURL}/playlists/${playlist}`);
    const songs = await response.json();

    songs.forEach(song => {
        const li = document.createElement("li");
        li.innerText = song.replace(".mp3", "");
        li.onclick = () => playSong(playlist, song);
        songContainer.appendChild(li);
    });
}

// ▶ Play a Song
function playSong(playlist, song) {
    audioPlayer.src = `${backendURL}/songs/${playlist}/${song}`;
    audioPlayer.play();
    songInfo.innerText = `Playing: ${song.replace(".mp3", "")}`;
}

// ⏯ Play/Pause Button
document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.getElementById("play");

    if (playButton) {
        playButton.onclick = () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playButton.src = "img/pause.svg"; // Change icon to pause
            } else {
                audioPlayer.pause();
                playButton.src = "img/play.svg"; // Change icon to play
            }
        };
    } else {
        console.error("Play button not found!");
    }
});

// 🌟 Load Playlists on Page Load
window.onload = loadPlaylists;
