const songs = [
    {
        title: "Sitaare",
        artist: "Arijit Singh",
        src: "songs/Sitaare.mp3",
        cover: "covers/cover1.jpg"
    },

    {
        title: "Mann Mera",
        artist: "Gajendra Verma",
        src: "songs/Mann Mera.mp3",
        cover: "covers/cover2.jpg"
    },

    {
        title: "Khat",
        artist: "Navjot Ahuja",
        src: "songs/Khat.mp3",
        cover: "covers/cover3.jpg"
    },

    {
        title: "Bairan",
        artist: "Banjaare",
        src: "songs/Bairan.mp3",
        cover: "covers/cover4.jpg"
    },

    {
        title: "Dil Lagana Mana Tha",
        artist: "Krish Mondal, Kishore Mondal",
        src: "songs/Dil lagana mana tha.mp3",
        cover: "covers/cover5.jpg"
    },

    {
        title: "Khasara",
        artist: "Abdul Hannan, Samar Jafri",
        src: "songs/Khasara.mp3",
        cover: "covers/cover6.jpg"
    }
];

const currentSong = new Audio();
let isPlaying = false;
let currentIndex = 0;
currentSong.volume = 0.5;

const albumImage = document.querySelector(".album-img");
const songName = document.querySelector(".song-name");
const artistName = document.querySelector(".artist-name");

const seekBar = document.querySelector(".seek-bar");
const seekProgress = document.querySelector(".seek-progress");

const currentTime = document.querySelector(".current-time");
const totalTime = document.querySelector(".total-time");

const prevButton = document.querySelector(".prev-button");
const playButton = document.querySelector(".play-button");
const nextButton = document.querySelector(".next-button");

const volumeIcon = document.querySelector(".volume-icon");
const volumeRange = document.querySelector(".volume-range");

const songsList = document.querySelector(".songs-list");

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if (secs < 10) {
        secs = "0" + secs;
    }

    return `${minutes}:${secs}`;
}

function loadSong(index) {
    currentSong.src = songs[index].src;

    albumImage.src = songs[index].cover;

    songName.innerHTML = songs[index].title;

    artistName.innerHTML = songs[index].artist;
}

function playPause() {
    const playButtonIcon = playButton.firstElementChild;

    if (!isPlaying) {
        currentSong.play();
        isPlaying = true;
        playButtonIcon.classList.replace("fa-play", "fa-pause");
    } else {
        currentSong.pause();
        isPlaying = false;
        playButtonIcon.classList.replace("fa-pause", "fa-play");
    }
}

function nextSong() {
    currentIndex++;

    if (currentIndex === songs.length) {
        currentIndex = 0;
    }

    loadSong(currentIndex);
    isPlaying = false;
    playPause();
}

function previousSong() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = songs.length - 1;
    }

    loadSong(currentIndex);
    isPlaying = false;
    playPause();
}

function renderPlaylist() {
    songsList.innerHTML = "";
    songs.forEach((song, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <p class = "song-number"> ${index+1} </p>
            <div class = "song-title"> ${songs[index].title} </div>
            <div class = "artist" > ${songs[index].artist} </div>
        `;
        li.addEventListener("click", () => {
            currentIndex = index;
            isPlaying = false;
            loadSong(currentIndex);
            playPause();
        });

        songsList.append(li);        
    });
}

function main() {
    let previousVolume;

    loadSong(currentIndex);

    playButton.addEventListener("click", playPause);

    nextButton.addEventListener("click", nextSong);

    prevButton.addEventListener("click", previousSong);

    // Adding an event listener to currentSong
    currentSong.addEventListener("timeupdate", (e) => {
        // 1. updating time:
        currentTime.innerHTML = `${formatTime(currentSong.currentTime)}`;

        totalTime.innerHTML = `${formatTime(currentSong.duration)}`;

        // 2. updating seekbar progress width:
        let percent = (currentSong.currentTime / currentSong.duration) * 100;
        seekProgress.style.width = percent + "%";

        // 3. Auto play next song:
        if (currentSong.currentTime > 0 && currentSong.currentTime >= currentSong.duration) {
            nextSong();
        }
    });

    // Adding an event listener to seekBar
    seekBar.addEventListener("click", (e) => {
        // 1. calculating the current position and total width
        let distanceX = e.offsetX;
        let seekBarWidth = e.target.getBoundingClientRect().width;

        // 2. getting the percent number for the position relative to width
        let percent = (distanceX / seekBarWidth) * 100;

        // 3. updating currentSong.currentTime
        currentSong.currentTime = (currentSong.duration * percent) / 100;

        // 4. displaying the updated current time
        currentTime.innerHTML = formatTime(currentSong.currentTime);

        // 5. Updating the seekProgress
        seekProgress.style.width = `${percent}%`;
    });

    // Adding an event listener to volumeRange
    volumeRange.addEventListener("change", (e) => {
        // 1. Getting the range Value : 0 - 100
        let volumeRangeValue = volumeRange.value;

        // 2. dividing it by 100 to make it valid for Audio()
        volumeRangeValue = volumeRangeValue / 100;

        // 3. Updating currentSong's volume based on range
        currentSong.volume = volumeRangeValue;

        // 4. updating the volume icon
        const volumeIconChild = volumeIcon.firstElementChild;

        if (currentSong.volume === 0) {
            volumeIconChild.classList.replace("fa-volume-high", "fa-volume-xmark");
        } else {
            volumeIconChild.classList.replace("fa-volume-xmark", "fa-volume-high");
        }
    });

    // Adding an event listener to volumeIcon
    volumeIcon.addEventListener("click", (e) => {
        const volumeIconChild = volumeIcon.firstElementChild;

        if (volumeIconChild.classList.contains("fa-volume-high")) {
            // saving the current Volume:
            previousVolume = currentSong.volume;

            volumeIconChild.classList.replace("fa-volume-high", "fa-volume-xmark");
            currentSong.volume = 0;
            volumeRange.value = 0;
        } else {
            volumeIconChild.classList.replace("fa-volume-xmark", "fa-volume-high");
            currentSong.volume = previousVolume;
            volumeRange.value = previousVolume * 100;
        }
    });

    renderPlaylist();
}

main();