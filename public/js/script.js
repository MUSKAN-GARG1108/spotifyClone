const backendURL = "https://spotifyclone-gvqn.onrender.com";
// const backendURL = "http://localhost:3000/";
const playlistContainer = document.querySelector(".cardContainer");
const songContainer = document.querySelector(".songList ul");
const songInfo = document.querySelector(".songinfo");
const audioPlayer = new Audio();
const seekbar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");
const songTimeDisplay = document.querySelector(".songtime");
const playButton = document.getElementById("play");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("previous");
const volumeIcon = document.querySelector(".volume img");
const volumeSlider = document.querySelector(".volume input");
const hamburger = document.querySelector(".hamburger");
const closeBtn = document.querySelector(".close");
const leftPanel = document.querySelector(".left");

let currentPlaylist = "";
let songIndex = 0;
let currentSongs = [];

// 🎵 Show Hamburger Menu
hamburger.addEventListener("click", () => {
    leftPanel.classList.add("show");
});

// ❌ Close Hamburger Menu
closeBtn.addEventListener("click", () => {
    leftPanel.classList.remove("show");
});

// 🚀 Load Playlists
async function loadPlaylists() {
    playlistContainer.innerHTML = '';

    const playlists = [
        "Diljit", "karan_aujla", "ncs", "Flute_Music", "English_Hits"
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

// 🎵 Load Songs
async function loadSongs(playlist) {
    songContainer.innerHTML = "";
    currentPlaylist = playlist;
    songIndex = 0;

    try {
        const response = await fetch(`${backendURL}/songs/${playlist}/info.json`);
        if (!response.ok) throw new Error(`Playlist not found: ${playlist}`);

        const data = await response.json();
        currentSongs = data.songs;

        if (!currentSongs || currentSongs.length === 0) {
            songContainer.innerHTML = `<p class="error-message">No songs available in this playlist</p>`;
            return;
        }

        currentSongs.forEach((song, index) => {
            const li = document.createElement("li");
            li.innerText = song.replace(".mp3", "");
            li.onclick = () => {
                songIndex = index;
                playSong();
            };
            songContainer.appendChild(li);
        });

        playSong(); // Auto-play first song

    } catch (error) {
        console.error(`Failed to load songs for ${playlist}:`, error);
        songContainer.innerHTML = `<p class="error-message">Failed to load songs</p>`;
    }
}

// ▶ Play a Song
function playSong() {
    if (currentSongs.length === 0) return;

    const song = currentSongs[songIndex];
    console.log(`Playing song: ${song}`);

    audioPlayer.src = `${backendURL}/songs/${currentPlaylist}/${song}`;
    audioPlayer.load();  // Ensure the audio file is loaded properly
    audioPlayer.play();
    songInfo.innerText = `Playing: ${song.replace(".mp3", "")}`;
    playButton.src = "img/pause.svg";  // Update play/pause icon
}

// ⏭ Next Song
nextButton.addEventListener("click", () => {
    if (songIndex < currentSongs.length - 1) {
        songIndex++;
        playSong();
    }
});

// ⏮ Previous Song
prevButton.addEventListener("click", () => {
    if (songIndex > 0) {
        songIndex--;
        playSong();
    }
});

// ⏯ Play/Pause Button
playButton.onclick = () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playButton.src = "img/pause.svg"; // Change icon to pause
    } else {
        audioPlayer.pause();
        playButton.src = "img/play.svg"; // Change icon to play
    }
};

// 🎵 Auto-Play Next Song on End
audioPlayer.addEventListener("ended", () => {
    console.log("Song ended! Trying to play next...");
    if (songIndex < currentSongs.length - 1) {
        songIndex++;
        playSong();
    } else {
        console.log("No more songs in the playlist.");
    }
});

// 🎵 Update Seekbar & Time
audioPlayer.addEventListener("timeupdate", () => {
    if (!audioPlayer.duration) return;

    // Update seekbar position
    let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    circle.style.left = `${progress}%`;

    // Update time display
    let currentTime = formatTime(audioPlayer.currentTime);
    let duration = formatTime(audioPlayer.duration);
    songTimeDisplay.innerText = `${currentTime} / ${duration}`;
});

// 📍 Seekbar Click to Jump
seekbar.addEventListener("click", (e) => {
    const seekbarWidth = seekbar.clientWidth;
    const clickPosition = e.offsetX;
    const seekTime = (clickPosition / seekbarWidth) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
});

// 🎵 Format Time (MM:SS)
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// 🔊 Volume Control
volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = volumeSlider.value / 100;
    updateVolumeIcon();
});

// 🔇 Mute/Unmute Functionality
volumeIcon.addEventListener("click", () => {
    if (audioPlayer.volume > 0) {
        audioPlayer.volume = 0;
        volumeSlider.value = 0;
    } else {
        audioPlayer.volume = 0.5; // Default volume when unmuting
        volumeSlider.value = 50;
    }
    updateVolumeIcon();
});

// 🎵 Update Volume Icon Based on Volume Level
function updateVolumeIcon() {
    if (audioPlayer.volume === 0) {
        volumeIcon.src = "img/mute.svg"; // Show mute icon
    } else if (audioPlayer.volume < 0.5) {
        volumeIcon.src = "img/volume.svg"; // Show low-volume icon
    } else {
        volumeIcon.src = "img/volume.svg"; // Show normal volume icon
    }
}

// ⏭ Backup: Force Auto-Play Next Song if `ended` Fails
setInterval(() => {
    if (audioPlayer.currentTime > 0 && audioPlayer.currentTime === audioPlayer.duration) {
        console.log("Forcing next song...");
        if (songIndex < currentSongs.length - 1) {
            songIndex++;
            playSong();
        }
    }
}, 1000);

// 🌟 Load Playlists on Page Load
window.onload = loadPlaylists;
