const playlist = document.getElementById("playlist");
const audioPlayer = document.getElementById("audioPlayer");

// Define your song list (You can get this dynamically later)
const songs = ["song1.mp3", "song2.mp3", "song3.mp3"];

// Generate song buttons dynamically
songs.forEach(song => {
    const btn = document.createElement("button");
    btn.innerText = song.replace(".mp3", ""); // Display song name
    btn.onclick = () => {
        audioPlayer.src = `http://localhost:3000/songs/${song}`;
        audioPlayer.play();
    };
    playlist.appendChild(btn);
});
