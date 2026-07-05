# 🎵 Music Player App — PULSE

A sleek, glassmorphism-styled music player built with vanilla HTML, CSS, and JavaScript. Features per-song cover art, animated seek bar, volume control, and a smooth mobile overlay experience. 

---

## 🔗 Live Demo

> _https://music-player-pulse.vercel.app_

---

## ✨ Features

- Play / Pause / Next / Previous song controls
- Per-song album art that transitions with a smooth fade + scale animation
- Real-time seek bar — click anywhere to jump to that timestamp
- Live current time and total duration display
- Volume slider with mute/unmute toggle
- Auto-play next song when current song ends
- Playlist panel with active song highlighting
- Mobile overlay : tap a song to slide up the full player, close with chevron
- Glassmorphism UI with animated purple glow background
- Responsive design for desktop and mobile

---

## 🗂️ Project Structure

```
MusicPlayer_PULSE/
├── index.html          # App markup — player card + playlist panel
├── css/
│   └── style.css       # Glassmorphism design, animations, responsive
├── js/
│   └── script.js       # All music player logic
├── songs/              # MP3 audio files
│   ├── Sitaare.mp3
│   ├── Mann Mera.mp3
│   ├── Khat.mp3
│   ├── Bairan.mp3
│   ├── Dil lagana mana tha.mp3
│   └── Khasara.mp3
└── covers/             # Per-song cover images
    ├── cover1.jpg
    ├── cover2.jpg
    ├── cover3.jpg
    ├── cover4.jpg
    ├── cover5.jpg
    └── cover6.jpg
```

---

## 🧠 JavaScript Logic: Deep Dive

All state lives in three top-level variables:

```js
const currentSong = new Audio();
let currentIndex = 0;
let isPlaying = false;
```

Every function reads or updates these three to keep the UI and audio in sync.

---

### `loadSong(index)` — Load Song Data into UI

The core function. Called every time the song changes.

Adds a `.changing` class to the album image to trigger a CSS fade-out + scale-down transition, then inside a `setTimeout(300ms)` — matching the CSS transition duration — updates the src, cover, title, and artist, then removes `.changing` to fade back in.

```js
albumImage.classList.add("changing");
setTimeout(() => {
    currentSong.src = songs[index].src;
    albumImage.src = songs[index].cover;
    songName.innerHTML = songs[index].title;
    artistName.innerHTML = songs[index].artist;
    albumImage.classList.remove("changing");
    highlightCurrentSong();
}, 300);
```

The 300ms delay is also why `playPause()` calls in `nextSong()`, `previousSong()`, and playlist click listeners are all wrapped in matching `setTimeout(300ms)` — so audio src is ready before `.play()` is called.

---

### `playPause()` — Toggle Play/Pause

Checks `isPlaying`, plays or pauses `currentSong`, updates the flag, and swaps the Font Awesome icon class using `classList.replace()`:

```js
playButtonIcon.classList.replace("fa-play", "fa-pause");
```

Before calling `playPause()` after a song change, `isPlaying` is always reset to `false` — this forces the function to always enter the play branch for the new song regardless of previous state.

---

### `nextSong()` / `previousSong()` — Navigation

Increments or decrements `currentIndex` with wraparound logic:

```js
// Next — loop back to 0 at end
if (currentIndex === songs.length) currentIndex = 0;

// Previous — loop to last song at start
if (currentIndex < 0) currentIndex = songs.length - 1;
```

Both call `loadSong()` then `playPause()` inside a 300ms timeout.

---

### `timeupdate` Event — Seek Bar + Auto Next

Fires continuously while the song plays. Does three things:

1. Updates `currentTime` and `totalTime` displays using `formatTime()`
2. Updates `.seek-progress` width as a percentage of song completion
3. Detects song end and calls `nextSong()`:

```js
if (currentSong.currentTime > 0 && currentSong.currentTime >= currentSong.duration) {
    nextSong();
}
```

The `> 0` guard prevents false triggers at page load before any song plays.

---

### Seek Bar Click — Jump to Timestamp

```js
seekBar.addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    currentSong.currentTime = (currentSong.duration * percent) / 100;
    seekProgress.style.width = `${percent}%`;
});
```

`e.offsetX` gives pixels from the left edge of the seek bar. Dividing by total width gives a 0–100 percentage, which maps directly to song duration.

---

### Volume Control — Slider + Mute Toggle

The range slider maps 0–100 to 0.0–1.0 for the Audio API:

```js
currentSong.volume = volumeRange.value / 100;
```

The mute toggle saves `currentSong.volume` into `previousVolume` before zeroing it, and restores it on unmute. The icon swaps between `fa-volume-high` and `fa-volume-xmark` using `classList.replace()`.

---

### `renderPlaylist()` — Dynamic Song List

Loops through the `songs` array, creates `<li>` elements with song number, title, and artist, and attaches click listeners to each. Each listener sets `currentIndex`, resets `isPlaying`, calls `loadSong()`, and calls `playPause()` inside a 300ms timeout.

---

### `highlightCurrentSong()` — Active Song Indicator

Removes `.playing` class from all `<li>` elements, then adds it only to the one matching `currentIndex`. Called inside `loadSong()` after the 300ms timeout so it always reflects the correct song.

---

### Mobile Overlay — Slide-Up Player

On screens below 768px, `.player-card` is `position: fixed` and hidden at `bottom: -140%`. When a song is clicked in the playlist, `.active` class is added, sliding it up to `bottom: 0`. The close button (chevron down) removes `.active` to slide it back down.

```js
songsList.addEventListener("click", () => {
    if (window.innerWidth <= 768) playerCard.classList.add("active");
});
closeBtn.addEventListener("click", () => {
    playerCard.classList.remove("active");
});
```

---

## 🎨 Design Highlights

- **Color scheme:** `#0a0a0a` to `#1a0533` gradient background, `#b388ff` purple accent
- **Glassmorphism:** `backdrop-filter: blur(20px)` with semi-transparent border on both cards
- **Animated glow:** `body::before` pseudo-element with `filter: blur(150px)` floats around with a CSS keyframe animation
- **Album art transition:** `.changing` class triggers `opacity: 0` + `scale(0.95)` simultaneously on song change
- **Seek bar hover:** Grows from 4px to 7px on hover using CSS transition
- **Hover vs touch:** All hover effects wrapped in `@media (hover: hover)` — separate `:active` states handle touch feedback
- **Font:** Inter (Google Fonts) — clean, modern, distinct from Poppins used in Spotify Clone
- **Icons:** Font Awesome 6.5 — no custom SVG files needed

---

## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| HTML5 | Semantic structure, Audio API |
| CSS3 | Glassmorphism, animations, responsive layout |
| JavaScript ES6+ | All player logic, DOM manipulation |
| Font Awesome 6.5 | Control and volume icons |
| Inter (Google Fonts) | Typography |
| Netlify | Deployment |

---

## 📱 Responsive Behavior

| Screen | Layout |
|--------|--------|
| Desktop (768px+) | Side-by-side — player card left, playlist right |
| Mobile (below 768px) | Playlist only visible by default, player slides up as full-screen overlay on song tap |

---

## 🎵 Songs Included

| # | Title | Artist |
|---|-------|--------|
| 1 | Sitaare | Arijit Singh |
| 2 | Mann Mera | Gajendra Verma |
| 3 | Khat | Navjot Ahuja |
| 4 | Bairan | Banjaare |
| 5 | Dil Lagana Mana Tha | Krish Mondal, Kishore Mondal |
| 6 | Khasara | Abdul Hannan, Samar Jafri |

---

## 🔮 Future Enhancements

- Shuffle and repeat modes
- Keyboard shortcuts (Space to play, arrow keys for next/prev)
- Song duration display in playlist
- Drag-to-seek on mobile (touch events)
- LocalStorage — remember last played song and volume
- Dynamic song loading from a JSON file or backend API

---

## 🚀 Getting Started

No build tools or dependencies required.

```bash
git clone https://github.com/Saqib216/music-player-pulse.git
cd MusicPlayer
# Open index.html in your browser or use VS Code Live Server
```

---

## 👨‍💻 Author

**Muhammad Saqib Hussnain**

- [GitHub](https://github.com/Saqib216)
- [LinkedIn](https://www.linkedin.com/in/saqib-hussnain)
- [Portfolio](https://saqib-portfo.netlify.app)
- [Instagram](https://instagram.com/itx.saqib.hussnain)

---

## 📄 License

This project is open source and available for educational and personal use.