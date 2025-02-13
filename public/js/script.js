const backendURL = "https://spotifyclone-gvqn.onrender.com";
const playlistContainer = document.querySelector(".cardContainer");
const songContainer = document.querySelector(".songList ul");
const songInfo = document.querySelector(".songinfo");
const audioPlayer = new Audio();
const playButton = document.getElementById("play");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("previous");

let currentPlaylist = "";
let currentSongs = [];
let currentIndex = 0;

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

// 🎵 Load Songs & Auto-Play First Song
async function loadSongs(playlist) {
    songContainer.innerHTML = "";
    currentPlaylist = playlist;
    currentSongs = [];
    currentIndex = 0;

    try {
        const response = await fetch(`${backendURL}/songs/${encodeURIComponent(playlist)}/info.json`);
        if (!response.ok) throw new Error(`Playlist not found: ${playlist}`);

        const playlistData = await response.json();
        currentSongs = playlistData.songs;

        if (!currentSongs || currentSongs.length === 0) {
            songContainer.innerHTML = `<p class="error-message">No songs available in this playlist</p>`;
            return;
        }

        currentSongs.forEach((song, index) => {
            const li = document.createElement("li");
            li.innerText = song.replace(".mp3", "");
            li.onclick = () => playSong(index);
            songContainer.appendChild(li);
        });

        playSong(0); // Auto-play first song

    } catch (error) {
        console.error(`Failed to load songs for ${playlist}:`, error);
        songContainer.innerHTML = `<p class="error-message">Failed to load songs</p>`;
    }
}

// ▶ Play a Song & Update Buttons
function playSong(index) {
    if (index < 0 || index >= currentSongs.length) return;

    currentIndex = index;
    audioPlayer.src = `${backendURL}/songs/${currentPlaylist}/${currentSongs[currentIndex]}`;
    audioPlayer.play();
    songInfo.innerText = `Playing: ${currentSongs[currentIndex].replace(".mp3", "")}`;
    playButton.src = "img/pause.svg"; // Change play button to pause
}

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


// Next & Previous Button Fix
document.getElementById("next").addEventListener("click", () => {
    let currentIndex = songs.findIndex(song => 
        decodeURIComponent(song) === decodeURIComponent(currentSong.src.split("/").pop())
    );

    if (currentIndex !== -1 && currentIndex + 1 < songs.length) {
        playMusic(songs[currentIndex + 1]);
    }
});

document.getElementById("previous").addEventListener("click", () => {
    let currentIndex = songs.findIndex(song => 
        decodeURIComponent(song) === decodeURIComponent(currentSong.src.split("/").pop())
    );

    if (currentIndex > 0) {
        playMusic(songs[currentIndex - 1]);
    }
});


// ⏯ Play/Pause Button
playButton.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playButton.src = "img/pause.svg";
    } else {
        audioPlayer.pause();
        playButton.src = "img/play.svg";
    }
});

// 🌟 Load Playlists on Page Load
window.onload = loadPlaylists;


// Main function
async function main() {
    await getSongs("songs/ncs");
    playMusic(songs[0], true);
    await displayAlbums();

    // Play/Pause Button
    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play").src = "img/pause.svg";
        } else {
            currentSong.pause();
            document.getElementById("play").src = "img/play.svg";
        }
    });

    // Update song time and progress bar
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = 
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Seekbar functionality
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Volume Control
    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = e.target.value / 100;
        document.querySelector(".volume img").src = currentSong.volume > 0 ? "img/volume.svg" : "img/mute.svg";
    });

    // Mute/Unmute Button
    let lastVolume = 1.0; // Store last volume

    document.querySelector(".volume img").addEventListener("click", (e) => {
        if (e.target.src.includes("volume.svg")) {
            lastVolume = currentSong.volume;  // Store current volume
            e.target.src = "img/mute.svg";
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = "img/volume.svg";
            currentSong.volume = lastVolume;  // Restore previous volume
            document.querySelector(".range input").value = lastVolume * 100;
        }
    });



}

main();
