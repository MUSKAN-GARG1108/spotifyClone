const playlist = document.getElementById("playlist");
const audioPlayer = document.getElementById("audioPlayer");
const backendURL = "https://spotifyclone-gvqn.onrender.com";

// Define your song list (You can get this dynamically later)
const songs = ["song1.mp3", "song2.mp3", "song3.mp3"];

// Generate song buttons dynamically
songs.forEach(song => {
    const btn = document.createElement("button");
    btn.innerText = song.replace(".mp3", "");
    btn.onclick = () => {
        audioPlayer.src = `${backendURL}/songs/${song}`;
        audioPlayer.play();
    };
    playlist.appendChild(btn);
});
