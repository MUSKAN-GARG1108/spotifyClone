// const backendURL = "https://spotifyclone-gvqn.onrender.com";
// const playlistContainer = document.querySelector(".cardContainer");
// const songContainer = document.querySelector(".songList ul");
// const songInfo = document.querySelector(".songinfo");
// const audioPlayer = new Audio();
// const playButton = document.getElementById("play");
// const nextButton = document.getElementById("next");
// const prevButton = document.getElementById("previous");

// let currentPlaylist = "";
// let currentSongs = [];
// let currentIndex = 0;

// // 🚀 Load Playlists with Cover, Title, and Description
// async function loadPlaylists() {
//     playlistContainer.innerHTML = ''; // Clear existing playlists

//     const playlists = [
//         "Angry_(mood)", "Bright_(mood)", "Chill_(mood)", "Dark_(mood)",
//         "Diljit", "Funky_(mood)", "Love_(mood)", "Uplifting_(mood)", "cs", "karan_aujla", "ncs"
//     ];

//     for (let playlist of playlists) {
//         try {
//             let response = await fetch(`${backendURL}/songs/${playlist}/info.json`);
//             if (!response.ok) throw new Error(`Playlist info not found: ${playlist}`);

//             let data = await response.json();

//             let card = document.createElement('div');
//             card.classList.add('card');
//             card.innerHTML = `
//                 <img src="${backendURL}/songs/${playlist}/cover.jpg" 
//                      alt="${data.title}" 
//                      class="cover-img" 
//                      onerror="this.src='img/default-cover.jpg'">
//                 <h3>${data.title}</h3>
//                 <p>${data.description}</p>
//             `;
//             card.addEventListener("click", () => loadSongs(playlist));

//             playlistContainer.appendChild(card);
//         } catch (error) {
//             console.error(`Failed to load ${playlist}:`, error);
//         }
//     }
// }

// // 🎵 Load Songs & Auto-Play First Song
// async function loadSongs(playlist) {
//     songContainer.innerHTML = "";
//     currentPlaylist = playlist;
//     currentSongs = [];
//     currentIndex = 0;

//     try {
//         const response = await fetch(`${backendURL}/songs/${encodeURIComponent(playlist)}/info.json`);
//         if (!response.ok) throw new Error(`Playlist not found: ${playlist}`);

//         const playlistData = await response.json();
//         currentSongs = playlistData.songs;

//         if (!currentSongs || currentSongs.length === 0) {
//             songContainer.innerHTML = `<p class="error-message">No songs available in this playlist</p>`;
//             return;
//         }

//         currentSongs.forEach((song, index) => {
//             const li = document.createElement("li");
//             li.innerText = song.replace(".mp3", "");
//             li.onclick = () => playSong(index);
//             songContainer.appendChild(li);
//         });

//         playSong(0); // Auto-play first song

//     } catch (error) {
//         console.error(`Failed to load songs for ${playlist}:`, error);
//         songContainer.innerHTML = `<p class="error-message">Failed to load songs</p>`;
//     }
// }

// // ▶ Play a Song & Update Buttons
// function playSong(index) {
//     if (index < 0 || index >= currentSongs.length) return;

//     currentIndex = index;
//     audioPlayer.src = `${backendURL}/songs/${currentPlaylist}/${currentSongs[currentIndex]}`;
//     audioPlayer.play();
//     songInfo.innerText = `Playing: ${currentSongs[currentIndex].replace(".mp3", "")}`;
//     playButton.src = "img/pause.svg"; // Change play button to pause
// }

// // ⏭ Next Song
// nextButton.addEventListener("click", () => {
//     if (currentIndex < currentSongs.length - 1) {
//         playSong(currentIndex + 1);
//     }
// });

// // ⏮ Previous Song
// prevButton.addEventListener("click", () => {
//     if (currentIndex > 0) {
//         playSong(currentIndex - 1);
//     }
// });



// // ⏯ Play/Pause Button
// playButton.addEventListener("click", () => {
//     if (audioPlayer.paused) {
//         audioPlayer.play();
//         playButton.src = "img/pause.svg";
//     } else {
//         audioPlayer.pause();
//         playButton.src = "img/play.svg";
//     }
// });

// // 🌟 Load Playlists on Page Load
// window.onload = loadPlaylists;











const backendURL = "https://spotifyclone-gvqn.onrender.com";
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

let currentPlaylist = "";
let songIndex = 0;
let currentSongs = [];

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

// 🎵 Load Songs when a Playlist is Clicked
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

        // Auto-play first song
        playSong();

    } catch (error) {
        console.error(`Failed to load songs for ${playlist}:`, error);
        songContainer.innerHTML = `<p class="error-message">Failed to load songs</p>`;
    }
}

// ▶ Play a Song
function playSong() {
    if (currentSongs.length === 0) return;

    const song = currentSongs[songIndex];
    audioPlayer.src = `${backendURL}/songs/${currentPlaylist}/${song}`;
    audioPlayer.play();
    songInfo.innerText = `Playing: ${song.replace(".mp3", "")}`;
    playButton.src = "img/pause.svg"; // Change icon to pause
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

// 🌟 Load Playlists on Page Load
window.onload = loadPlaylists;
