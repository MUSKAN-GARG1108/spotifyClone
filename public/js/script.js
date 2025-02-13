const backendURL = "https://spotifyclone-gvqn.onrender.com";
const playlistContainer = document.querySelector(".cardContainer");
const songContainer = document.querySelector(".songList ul");
const songInfo = document.querySelector(".songinfo");
const audioPlayer = new Audio();
let currentPlaylist = "";

// 🚀 Load Playlists with Cover, Title, and Description
async function loadPlaylists() {
    const playlistsContainer = document.querySelector('.cardContainer');
    playlistsContainer.innerHTML = '';

    const playlists = [
        "Angry_(mood)", "Bright_(mood)", "Chill_(mood)", "Dark_(mood)",
        "Diljit", "Funky_(mood)", "Love_(mood)", "Uplifting_(mood)", "cs", "karan aujla", "ncs"
    ];

    for (let playlist of playlists) {
        try {
            // Fetch the playlist info.json
            let response = await fetch(`songs/${playlist}/info.json`);
            let data = await response.json();

            // Create the playlist card
            let card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="songs/${playlist}/cover.jpg" alt="${data.title}" class="cover-img">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
            `;

            // Append to container
            playlistsContainer.appendChild(card);
        } catch (error) {
            console.error(`Failed to load ${playlist}:`, error);
        }
    }
}

// Load playlists on page load
document.addEventListener("DOMContentLoaded", loadPlaylists);

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
