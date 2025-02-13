const backendURL = "https://spotifyclone-gvqn.onrender.com";
const playlistContainer = document.querySelector(".cardContainer");
const songContainer = document.querySelector(".songList ul");
const songInfo = document.querySelector(".songinfo");
const audioPlayer = new Audio();
let currentPlaylist = "";
let currentSongIndex = 0;
let songsList = []; // Stores the current playlist songs

// 🚀 Load Playlists with Cover, Title, and Description
async function loadPlaylists() {
    playlistContainer.innerHTML = ''; // Clear existing playlists

    const playlists = [
        "Angry_(mood)", "Bright_(mood)", "Chill_(mood)", "Dark_(mood)",
        "Diljit", "Funky_(mood)", "Love_(mood)", "Uplifting_(mood)", "cs", "karan_aujla", "ncs"
    ];

    for (let playlist of playlists) {
        try {
            let response = await fetch(`${backendURL}/songs/${playlist}/info.json`);
            if (!response.ok) throw new Error(`Playlist info not found: ${playlist}`);

            let data = await response.json();

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

            playlistContainer.appendChild(card);
        } catch (error) {
            console.error(`Failed to load ${playlist}:`, error);
        }
    }
}

// 🎵 Load Songs when a Playlist is Clicked & Auto-Play the First Song
async function loadSongs(playlist) {
    songContainer.innerHTML = "";
    currentPlaylist = playlist;
    songsList = []; // Reset songs list

    try {
        const response = await fetch(`${backendURL}/playlists/${encodeURIComponent(playlist)}`);
        if (!response.ok) throw new Error(`Playlist not found: ${playlist}`);

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

        songsList = songs; // Store the songs for next/previous functionality
        currentSongIndex = 0; // Reset to first song

        songs.forEach((song, index) => {
            const li = document.createElement("li");
            li.innerText = song.replace(".mp3", "");
            li.onclick = () => playSong(index);
            songContainer.appendChild(li);
        });

        // Auto-play the first song
        playSong(0);
    } catch (error) {
        console.error(`Failed to load songs for ${playlist}:`, error);
        songContainer.innerHTML = `<p class="error-message">Failed to load songs</p>`;
    }
}

// ▶ Play a Song by Index
function playSong(index) {
    if (index < 0 || index >= songsList.length) return; // Prevent out-of-bounds errors

    currentSongIndex = index;
    const song = songsList[currentSongIndex];

    audioPlayer.src = `${backendURL}/songs/${currentPlaylist}/${song}`;
    audioPlayer.play();
    songInfo.innerText = `Playing: ${song.replace(".mp3", "")}`;

    // Show the play button and update UI
    updatePlayButton();
}

// ⏭ Next Song
function nextSong() {
    if (currentSongIndex < songsList.length - 1) {
        playSong(currentSongIndex + 1);
    }
}

// ⏮ Previous Song
function prevSong() {
    if (currentSongIndex > 0) {
        playSong(currentSongIndex - 1);
    }
}

// ⏯ Play/Pause Button
document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.getElementById("play");
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");

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

    if (nextButton) {
        nextButton.onclick = nextSong;
    } else {
        console.error("Next button not found!");
    }

    if (prevButton) {
        prevButton.onclick = prevSong;
    } else {
        console.error("Previous button not found!");
    }
});

// 🎵 Auto Play Next Song When Current Song Ends
audioPlayer.addEventListener("ended", nextSong);

// 🎵 Update Play Button UI
function updatePlayButton() {
    const playButton = document.getElementById("play");
    if (playButton) {
        playButton.src = "img/pause.svg"; // Change to pause when playing
    }
}

// 🌟 Load Playlists on Page Load
window.onload = loadPlaylists;
