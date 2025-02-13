const backendURL = "https://spotifyclone-gvqn.onrender.com";
const playlistContainer = document.querySelector(".cardContainer");
const songContainer = document.querySelector(".songList ul");
const songInfo = document.querySelector(".songinfo");
const audioPlayer = new Audio();
let currentPlaylist = "";

// 🚀 Load Playlists with Cover, Title, and Description
async function loadPlaylists() {
    playlistContainer.innerHTML = ''; // Clear existing playlists

    const playlists = [
        "Angry_(mood)", "Bright_(mood)", "Chill_(mood)", "Dark_(mood)",
        "Diljit", "Funky_(mood)", "Love_(mood)", "Uplifting_(mood)", "cs", "karan_aujla", "ncs"
    ];

    for (let playlist of playlists) {
        try {
            // Fetch the playlist info.json
            let response = await fetch(`${backendURL}/songs/${playlist}/info.json`);
            if (!response.ok) throw new Error(`Playlist info not found: ${playlist}`);

            let data = await response.json();

            // Create the playlist card
            let card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${backendURL}/songs/${playlist}/cover.jpg" 
                     alt="${data.title}" 
                     class="cover-img" 
                     onerror="this.src='img/default-cover.jpg'">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
            `;
            card.addEventListener("click", () => loadSongs(playlist));

            // Append to container
            playlistContainer.appendChild(card);
        } catch (error) {
            console.error(`Failed to load ${playlist}:`, error);
        }
    }
}

// 🎵 Load Songs when a Playlist is Clicked
async function loadSongs(playlist) {
    songContainer.innerHTML = "";
    currentPlaylist = playlist;

    try {
        const response = await fetch(`${backendURL}/playlists/${encodeURIComponent(playlist)}`);
        
        if (!response.ok) {
            throw new Error(`Playlist not found: ${playlist}`);
        }

        const songs = await response.json();

        if (songs.error) {
            console.error(songs.error);
            songContainer.innerHTML = `<p class="error-message">${songs.error}</p>`;
            return;
        }

        if (songs.length === 0) {
            songContainer.innerHTML = `<p class="error-message">No songs available in this playlist</p>`;
            return;
        }

        songs.forEach(song => {
            const li = document.createElement("li");
            li.innerText = song.replace(".mp3", "");
            li.onclick = () => playSong(playlist, song);
            songContainer.appendChild(li);
        });

    } catch (error) {
        console.error(`Failed to load songs for ${playlist}:`, error);
        songContainer.innerHTML = `<p class="error-message">Failed to load songs</p>`;
    }
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
