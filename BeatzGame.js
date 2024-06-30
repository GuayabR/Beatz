/**
 * Title: Beatz
 * Author: Victor//GuayabR
 * Date: 16/05/2024
 * Version: HFPS 3.2.12.10 test (release.version.subversion.bugfix)
 **/

// CONSTANTS

const VERSION = "HFPS 3.2.12.10 (Codename.Release.Version.Subversion.Bugfix)";
const PUBLICVERSION = "3.2! (GitHub Port)";
console.log("Version: " + VERSION);

const WIDTH = 1280;

const HEIGHT = 720;

const noteWidth = 50;

const noteHeight = 50;

const HIT_Y_RANGE_MIN = 500;

const HIT_Y_RANGE_MAX = 600;

const MIN_NOTE_GAP = 775;

const MAX_HIT_SOUNDS = 5;

const textY = 670;

const noteXPositions = {
    left: WIDTH / 2 - 110,
    up: WIDTH / 2 - 51,
    down: WIDTH / 2 + 51,
    right: WIDTH / 2 + 110,
};

const loadedImages = {};

const hitSounds = [];

let notesHit = 0;
let tutorialStage = 0;
let isNewPlayer = !localStorage.getItem("keybinds");

const keybindsText = {
    initial: {
        left: "A",
        up: "W",
        down: "S",
        right: "D",
    },
    customizable: "Keybinds are customizable in the settings just below the canvas.",
    thankYou: "Thank you for playing Beatz! Enjoy!",
    followMe: {
        announce: "Follow me on my socials!",
        twitter: "Twitter: @GuayabR",
        yt: "Youtube: @GuayabR",
    },
};

const noteImages = {
    Left: noteLeftIMG,
    Down: noteDownIMG,
    Up: noteUpIMG,
    Right: noteRightIMG,
};

const notePressImages = {
    Left: noteLeftPressIMG,
    Down: noteDownPressIMG,
    Up: noteUpPressIMG,
    Right: noteRightPressIMG,
};

console.log("Constants loaded.");

// VARIABLES

var ctx;

var timer;

var gameStarted = false;

let currentSong;

let songStarted = false;

let songStartTime;

let songPausedTime;

let currentSongPath;

let songList = [];

let songLoadCounter = 0;

let currentSongIndex = 0;

let dynamicSpeedInfo = "";

let speedUpdater;

var autoHitEnabled = false;

var notes = [];

var upPressed = false;

var downPressed = false;

var leftPressed = false;

var rightPressed = false;

var noteSpeed = 10;

var BPM = 0;

var MILLISECONDS_PER_BEAT;

var points = 0;

var totalMisses = 0;

var perfectHits = 0;

var earlyLateHits = 0;

let currentStreak = 0;

let maxStreak = 0;

var noteYPositions = {
    left: [],
    down: [],
    up: [],
    right: [],
};

var perfectText = {
    active: false,
    timer: 0,
};

var earlyLateText = {
    active: false,
    timer: 0,
};

var missText = {
    active: false,
    timer: 0,
};

var lastPerfectHitNoteType = null;
var lastEarlyLateNoteType = null;
var lastNoteType = null;

let canvasUpdating = false;

let autoHitDisableSaving = false; // Flag to disable score saving if autoHit has been enabled

let bestScoreLogged = {};

// Generate random notes for 4 minutes
var notes = generateRandomNotes(696969);

// Function to switch image source
function switchImage(img, src1, src2) {
    if (img.src.endsWith(src1)) {
        img.src = "Resources/" + src2;
    } else {
        img.src = "Resources/" + src1;
    }
}

document.getElementById("toggleNoteStyleButton").addEventListener("click", function () {
    toggleNoteStyle();
});

// Ensure images are loaded before drawing
window.onload = function () {
    var images = [noteLeftIMG, noteDownIMG, noteUpIMG, noteRightIMG, noteLeftPressIMG, noteDownPressIMG, noteUpPressIMG, noteRightPressIMG];

    var loadedImages = 0;
    images.forEach(function (image) {
        image.onload = function () {
            loadedImages++;
            if (loadedImages === images.length) {
                draw();
            }
        };
    });
};

let currentSongVolume = localStorage.getItem("songVolume") ? parseFloat(localStorage.getItem("songVolume")) : 0.5; // Load volume or default to 50%
let currentHitSoundVolume = localStorage.getItem("hitSoundVolume") ? parseFloat(localStorage.getItem("hitSoundVolume")) : 0.15; // Load volume or default to 15%

// Event listeners for volume sliders
songVolume.addEventListener("input", function () {
    currentSongVolume = this.value / 100; // Convert to range 0-1
    localStorage.setItem("songVolume", currentSongVolume); // Save to localStorage
    adjustSongVolume(currentSongVolume);
});

hitSoundSlider.addEventListener("input", function () {
    currentHitSoundVolume = this.value / 100; // Convert to range 0-1
    localStorage.setItem("hitSoundVolume", currentHitSoundVolume); // Save to localStorage
    adjustHitSoundVolume(currentHitSoundVolume);
});

// Function to adjust song volume
function adjustSongVolume(volume) {
    if (currentSong) {
        currentSong.volume = volume;
    }
}

// Function to adjust hit sound volume
function adjustHitSoundVolume(volume) {
    hitSounds.forEach((hitSound) => {
        hitSound.volume = volume;
    });
}

// Initialize hit sounds with the loaded volume
for (let i = 0; i < MAX_HIT_SOUNDS; i++) {
    let hitSound = new Audio("Resources/SFX/hitSound.mp3");
    hitSound.volume = currentHitSoundVolume; // Set volume to the saved or default volume
    hitSounds.push(hitSound);
}

console.log("Variables loaded.");

// TEXTURES

// IMAGES
var noteLeftIMG = new Image();
noteLeftIMG.src = "Resources/NoteLeftHQ.png";

var noteDownIMG = new Image();
noteDownIMG.src = "Resources/NoteDownHQ.png";

var noteUpIMG = new Image();
noteUpIMG.src = "Resources/NoteUpHQ.png";

var noteRightIMG = new Image();
noteRightIMG.src = "Resources/NoteRightHQ.png";

var noteLeftPressIMG = new Image();
noteLeftPressIMG.src = "Resources/NoteLeftPressHQ.png";

var noteDownPressIMG = new Image();
noteDownPressIMG.src = "Resources/NoteDownPressHQ.png";

var noteUpPressIMG = new Image();
noteUpPressIMG.src = "Resources/NoteUpPressHQ.png";

var noteRightPressIMG = new Image();
noteRightPressIMG.src = "Resources/NoteRightPressHQ.png";

var noCover = new Image();
noCover.src = "Resources/Covers/noCover.png";

var BGbright = new Image();
BGbright.src = "Resources/Background2.png";

var BG2 = new Image();
BG2.src = "Resources/Background3.jpg";

var BG3 = new Image();
BG3.src = "Resources/Background4.png";

var BG4 = new Image();
BG4.src = "Resources/BackgroundHtml2.png";

console.log("Textures loaded.");

// Function to preload songs
function preloadSongs() {
    const songPaths = [
        "Resources/Songs/Epilogue.mp3",
        "Resources/Songs/Exosphere.mp3",
        "Resources/Songs/Die For You.mp3",
        "Resources/Songs/Father Stretch My Hands.mp3",
        "Resources/Songs/Betty (Get Money).mp3",
        "Resources/Songs/BURN IT DOWN.mp3",
        "Resources/Songs/Aleph 0.mp3",
        "Resources/Songs/Better Days.mp3",
        "Resources/Songs/kompa pasion.mp3",
        "Resources/Songs/KOCMOC.mp3",
        "Resources/Songs/Legends Never Die.mp3",
        "Resources/Songs/Star Walkin.mp3",
        "Resources/Songs/What I've Done.mp3",
        "Resources/Songs/Biggest NCS Songs.mp3",
        "Resources/Songs/Goosebumps.mp3",
        "Resources/Songs/Sleepwalker X Icewhxre.mp3",
        "Resources/Songs/Numb.mp3",
        "Resources/Songs/sdp interlude.mp3",
        "Resources/Songs/Shiawase (VIP).mp3",
        "Resources/Songs/Master Of Puppets (Live).mp3",
        "Resources/Songs/Stressed Out.mp3",
        "Resources/Songs/Ticking Away.mp3",
        "Resources/Songs/VISIONS.mp3",
        "Resources/Songs/VVV.mp3",
        "Resources/Songs/WTF 2.mp3",
        "Resources/Songs/Somewhere I Belong.mp3",
        "Resources/Songs/Can't Slow Me Down.mp3",
        "Resources/Songs/LUNCH.mp3",
        "Resources/Songs/Butterfly Effect.mp3",
        "Resources/Songs/SWIM.mp3",
        "Resources/Songs/FE!N.mp3",
        "Resources/Songs/Crazy.mp3",
        "Resources/Songs/You Need Jesus.mp3",
        "Resources/Songs/Nautilus.mp3",
        "Resources/Songs/Levitating.mp3",
        "Resources/Songs/MY EYES.mp3",
        "Resources/Songs/Faint.mp3",
        "Resources/Songs/Breaking The Habit.mp3",
        "Resources/Songs/From The Inside.mp3",
        "Resources/Songs/I Wonder.mp3",
        "Resources/Songs/Godzilla.mp3",
        "Resources/Songs/Houdini.mp3",
        "Resources/Songs/Runaway.mp3",
        "Resources/Songs/Rush E.mp3",
        "Resources/Songs/Vamp Anthem.mp3",
        "Resources/Songs/CARNIVAL.mp3",
        "Resources/Songs/HUMBLE..mp3",
        "Resources/Songs/Stop Breathing.mp3",
        "Resources/Songs/CHEGOU 3.mp3",
        "Resources/Songs/KRUSH ALERT.mp3",
        "Resources/Songs/CUTE DEPRESSED.mp3",
        "Resources/Songs/MOVE YO BODY.mp3",
        "Resources/Songs/SLAY!.mp3",
        "Resources/Songs/ROCK THAT SHIT!.mp3",
        "Resources/Songs/BAIXO.mp3",
        "Resources/Songs/LOOK DON'T TOUCH.mp3",
        "Resources/Songs/YOU'RE TOO SLOW.mp3",
        "Resources/Songs/BAND4BAND.mp3",
        "Resources/Songs/HIGHEST IN THE ROOM.mp3",
        "Resources/Songs/Slide da Treme Melódica v2.mp3",
        "Resources/Songs/fantasmas.mp3",
        "Resources/Songs/BIKE.mp3",
        "Resources/Songs/ARCANGEL.mp3",
        "Resources/Songs/testingsong.mp3",
    ];

    let currentIndex = 0;
    const totalSongs = songPaths.length;

    // Add counter text beside the header
    const counterText = document.createElement("span");
    counterText.textContent = ` (${songLoadCounter}/${totalSongs} songs loaded)`;
    const headerElement = document.querySelector("h1");
    headerElement.appendChild(counterText);

    function loadNextSong() {
        if (currentIndex < totalSongs) {
            const songPath = songPaths[currentIndex];
            const songTitle = getSongTitle(songPath);
            const audio = new Audio();
            audio.src = songPath;
            audio.oncanplaythrough = function () {
                songList.push(songPath);
                console.log("Loaded song:", songTitle);
                songLoadCounter++; // Increment songLoadCounter when a song is successfully loaded
                currentIndex++;
                counterText.textContent = ` (${songLoadCounter}/${totalSongs} songs loaded)`; // Update the counter text
                loadNextSong(); // Load the next song recursively
                checkAllSongsLoaded(totalSongs); // Check if all songs are loaded
            };
            audio.onerror = function () {
                console.log("Failed to load song:", songTitle);
                currentIndex++;
                songLoadCounter++;
                counterText.textContent = ` (${songLoadCounter}/${totalSongs} songs loaded)`; // Update the counter text
                loadNextSong(); // Load the next song recursively
                checkAllSongsLoaded(totalSongs); // Check if all songs are loaded
            };
        }
    }

    // Function to check if all songs are loaded
    function checkAllSongsLoaded(totalSongs) {
        if (songLoadCounter === 10) {
            const startButton = document.getElementById("startButton");
            startButton.style.display = "inline";
        } else if (songLoadCounter === totalSongs) {
            populateSongSelector();
            setTimeout(() => {
                if (headerElement.contains(counterText)) {
                    headerElement.removeChild(counterText);
                }
            }, 2500);
        }
    }

    // Start loading the first song
    loadNextSong();
}

// Song configurations
const songConfigs = {
    "Resources/Songs/Epilogue.mp3": { BPM: 160, noteSpeed: 10 },
    "Resources/Songs/Exosphere.mp3": { BPM: 118, noteSpeed: 10 },
    "Resources/Songs/Die For You.mp3": { BPM: 95, noteSpeed: 8 },
    "Resources/Songs/Father Stretch My Hands.mp3": { BPM: 113, noteSpeed: 10 },
    "Resources/Songs/Betty (Get Money).mp3": { BPM: 102, noteSpeed: 8 },
    "Resources/Songs/BURN IT DOWN.mp3": { BPM: 110, noteSpeed: 8 },
    "Resources/Songs/Aleph 0.mp3": { BPM: 125, noteSpeed: 8 },
    "Resources/Songs/Better Days.mp3": { BPM: 132, noteSpeed: 6 },
    "Resources/Songs/KOCMOC.mp3": { BPM: 190, noteSpeed: 12 },
    "Resources/Songs/kompa pasion.mp3": { BPM: 98, noteSpeed: 7 },
    "Resources/Songs/Legends Never Die.mp3": { BPM: 140, noteSpeed: 10 },
    "Resources/Songs/Star Walkin.mp3": { BPM: 142, noteSpeed: 9 },
    "Resources/Songs/What I've Done.mp3": { BPM: 120, noteSpeed: 8 },
    "Resources/Songs/Biggest NCS Songs.mp3": { BPM: 110, noteSpeed: 8 },
    "Resources/Songs/Goosebumps.mp3": { BPM: 130, noteSpeed: 8 },
    "Resources/Songs/Master Of Puppets (Live).mp3": { BPM: 210, noteSpeed: 12 },
    "Resources/Songs/Numb.mp3": { BPM: 110, noteSpeed: 10 },
    "Resources/Songs/sdp interlude.mp3": { BPM: 108, noteSpeed: 8 },
    "Resources/Songs/Shiawase (VIP).mp3": { BPM: 150, noteSpeed: 12.2 },
    "Resources/Songs/Sleepwalker X Icewhxre.mp3": { BPM: 120, noteSpeed: 10 },
    "Resources/Songs/Stressed Out.mp3": { BPM: 170, noteSpeed: 8 },
    "Resources/Songs/Ticking Away.mp3": { BPM: 95, noteSpeed: 10 },
    "Resources/Songs/VISIONS.mp3": { BPM: 157, noteSpeed: 8 },
    "Resources/Songs/VVV.mp3": { BPM: 131, noteSpeed: 10 },
    "Resources/Songs/WTF 2.mp3": { BPM: 93, noteSpeed: 10 },
    "Resources/Songs/MY EYES.mp3": { BPM: 132, noteSpeed: 12 },
    "Resources/Songs/Can't Slow Me Down.mp3": { BPM: 122, noteSpeed: 11 },
    "Resources/Songs/LUNCH.mp3": { BPM: 125, noteSpeed: 14.6 }, //
    "Resources/Songs/Butterfly Effect.mp3": { BPM: 141, noteSpeed: 10 },
    "Resources/Songs/SWIM.mp3": { BPM: 120, noteSpeed: 10 },
    "Resources/Songs/You Need Jesus.mp3": { BPM: 110, noteSpeed: 11 },
    "Resources/Songs/Crazy.mp3": { BPM: 120, noteSpeed: 10 },
    "Resources/Songs/FE!N.mp3": { BPM: 148, noteSpeed: 12 },
    "Resources/Songs/Nautilus.mp3": { BPM: 124, noteSpeed: 9 },
    "Resources/Songs/Levitating.mp3": { BPM: 103, noteSpeed: 10 },
    "Resources/Songs/Somewhere I Belong.mp3": { BPM: 162, noteSpeed: 10 },
    "Resources/Songs/From The Inside.mp3": { BPM: 95, noteSpeed: 10.5 },
    "Resources/Songs/Faint.mp3": { BPM: 135, noteSpeed: 11 },
    "Resources/Songs/Breaking The Habit.mp3": { BPM: 100, noteSpeed: 10 },
    "Resources/Songs/I Wonder.mp3": { BPM: 127, noteSpeed: 8 },
    "Resources/Songs/Godzilla.mp3": { BPM: 166, noteSpeed: 13 },
    "Resources/Songs/Houdini.mp3": { BPM: 141, noteSpeed: 12 },
    "Resources/Songs/Runaway.mp3": { BPM: 85, noteSpeed: 10 },
    "Resources/Songs/Rush E.mp3": { BPM: 500, noteSpeed: 20 },
    "Resources/Songs/Vamp Anthem.mp3": { BPM: 164, noteSpeed: 12 },
    "Resources/Songs/CARNIVAL.mp3": { BPM: 148, noteSpeed: 12 },
    "Resources/Songs/HUMBLE..mp3": { BPM: 150, noteSpeed: 13 },
    "Resources/Songs/Stop Breathing.mp3": { BPM: 155, noteSpeed: 12 },
    "Resources/Songs/CHEGOU 3.mp3": { BPM: 130, noteSpeed: 13.2 },
    "Resources/Songs/KRUSH ALERT.mp3": { BPM: 117, noteSpeed: 12.5 },
    "Resources/Songs/CUTE DEPRESSED.mp3": { BPM: 228, noteSpeed: 16 }, // original bpm is 152 but increased it to match the beat
    "Resources/Songs/MOVE YO BODY.mp3": { BPM: 133, noteSpeed: 12 },
    "Resources/Songs/SLAY!.mp3": { BPM: 130, noteSpeed: 13 },
    "Resources/Songs/ROCK THAT SHIT!.mp3": { BPM: 125, noteSpeed: 12 },
    "Resources/Songs/BAIXO.mp3": { BPM: 133, noteSpeed: 12 },
    "Resources/Songs/LOOK DON'T TOUCH.mp3": { BPM: 125, noteSpeed: 13 },
    "Resources/Songs/MOVE YO BODY.mp3": { BPM: 133, noteSpeed: 12 },
    "Resources/Songs/YOU'RE TOO SLOW.mp3": { BPM: 162, noteSpeed: 14.5 },
    "Resources/Songs/BAND4BAND.mp3": { BPM: 140, noteSpeed: 14 },
    "Resources/Songs/HIGHEST IN THE ROOM.mp3": { BPM: 156, noteSpeed: 0 },
    "Resources/Songs/Slide da Treme Melódica v2.mp3": {
        BPM: 235,
        noteSpeed: 18,
    }, // original bpm is 157 but increased it to match the beat
    "Resources/Songs/fantasmas.mp3": { BPM: 164, noteSpeed: 10 },
    "Resources/Songs/BIKE.mp3": { BPM: 105, noteSpeed: 14 },
    "Resources/Songs/ARCANGEL.mp3": { BPM: 124, noteSpeed: 14 },
};

function getDynamicSpeed(songSrc) {
    const dynamicSpeeds = {
        "HIGHEST IN THE ROOM": [
            { timestamp: 12.9, noteSpeed: 25 }, // 0:12 (starting point)
            { timestamp: 13.35, noteSpeed: 12 }, // 0:13.35 (starting point 2)
            { timestamp: 25.9, noteSpeed: 14 }, // 0:26
            { timestamp: 112.8, noteSpeed: 9 }, // 1:54.8
        ],
        "Shiawase (VIP)": [
            { timestamp: 25.6, noteSpeed: 14.2 },
            { timestamp: 36.8, noteSpeed: 10 },
            { timestamp: 38.4, noteSpeed: 4 },
            { timestamp: 41.58, noteSpeed: 16.2 },
            { timestamp: 63.95, noteSpeed: 8.2 },
            { timestamp: 76.8, noteSpeed: 12.2 },
            { timestamp: 89.6, noteSpeed: 13.2 },
            { timestamp: 100.85, noteSpeed: 10 },
            { timestamp: 102.5, noteSpeed: 8.2 },
            { timestamp: 105.58, noteSpeed: 16.2 },
            { timestamp: 128.07, noteSpeed: 12.2 },
            { timestamp: 131.2, noteSpeed: 17.2 },
            { timestamp: 165.9, noteSpeed: 18.2, notes: [] },
            { timestamp: 169, noteSpeed: 18.2, endScreenDrawn: true },
        ],
        // Add more songs and their respective timestamp-speed mappings here
    };

    let songTitle = getSongTitle(songSrc);
    if (dynamicSpeeds.hasOwnProperty(songTitle)) {
        return dynamicSpeeds[songTitle];
    } else {
        return null;
    }
}

console.log("Song Configurations loaded.");

// Function to preload images
function preloadImages() {
    const albumCovers = [
        "Resources/Covers/Epilogue.jpg",
        "Resources/Covers/Exosphere.jpg",
        "Resources/Covers/Die For You.jpg",
        "Resources/Covers/Father Stretch My Hands.jpg",
        "Resources/Covers/Betty (Get Money).jpg",
        "Resources/Covers/BURN IT DOWN.jpg",
        "Resources/Covers/Aleph 0.jpg",
        "Resources/Covers/Better Days.jpg",
        "Resources/Covers/KOCMOC.jpg",
        "Resources/Covers/kompa pasion.jpg",
        "Resources/Covers/Legends Never Die.jpg",
        "Resources/Covers/Star Walkin.jpg",
        "Resources/Covers/What I've Done.jpg",
        "Resources/Covers/Biggest NCS Songs.jpg",
        "Resources/Covers/Goosebumps.jpg",
        "Resources/Covers/Master Of Puppets (Live).jpg",
        "Resources/Covers/Numb.jpg",
        "Resources/Covers/sdp interlude.jpg",
        "Resources/Covers/Shiawase (VIP).jpg",
        "Resources/Covers/Sleepwalker X Icewhxre.jpg",
        "Resources/Covers/Stressed Out.jpg",
        "Resources/Covers/Ticking Away.jpg",
        "Resources/Covers/VISIONS.jpg",
        "Resources/Covers/VVV.jpg",
        "Resources/Covers/WTF 2.jpg",
        "Resources/Covers/MY EYES.jpg",
        "Resources/Covers/Can't Slow Me Down.jpg",
        "Resources/Covers/LUNCH.jpg",
        "Resources/Covers/Butterfly Effect.jpg",
        "Resources/Covers/SWIM.jpg",
        "Resources/Covers/You Need Jesus.jpg",
        "Resources/Covers/Crazy.jpg",
        "Resources/Covers/FE!N.jpg",
        "Resources/Covers/Nautilus.jpg",
        "Resources/Covers/Levitating.jpg",
        "Resources/Covers/Somewhere I Belong.jpg",
        "Resources/Covers/From The Inside.jpg",
        "Resources/Covers/Faint.jpg",
        "Resources/Covers/Breaking The Habit.jpg",
        "Resources/Covers/I Wonder.jpg",
        "Resources/Covers/Godzilla.jpg",
        "Resources/Covers/Houdini.jpg",
        "Resources/Covers/Runaway.jpg",
        "Resources/Covers/Rush E.jpg",
        "Resources/Covers/Vamp Anthem.jpg",
        "Resources/Covers/CARNIVAL.jpg",
        "Resources/Covers/HUMBLE..jpg",
        "Resources/Covers/Stop Breathing.jpg",
        "Resources/Covers/CHEGOU 3.jpg",
        "Resources/Covers/KRUSH ALERT.jpg",
        "Resources/Covers/CUTE DEPRESSED.jpg",
        "Resources/Covers/MOVE YO BODY.jpg",
        "Resources/Covers/SLAY!.jpg",
        "Resources/Covers/ROCK THAT SHIT!.jpg",
        "Resources/Covers/BAIXO.jpg",
        "Resources/Covers/LOOK DON'T TOUCH.jpg",
        "Resources/Covers/YOU'RE TOO SLOW.jpg",
        "Resources/Covers/BAND4BAND.jpg",
        "Resources/Covers/HIGHEST IN THE ROOM.jpg",
        "Resources/Covers/Slide da Treme Melódica v2.jpg",
        "Resources/Covers/fantasmas.jpg",
        "Resources/Covers/BIKE.jpg",
        "Resources/Covers/ARCANGEL.jpg",
    ];

    for (const coverPath of albumCovers) {
        const songTitle = getSongTitle(coverPath);
        const coverImage = new Image();
        coverImage.src = coverPath;
        coverImage.onload = function () {
            loadedImages[songTitle] = coverImage;
            console.log("Loaded cover image for song:", songTitle);
        };
        coverImage.onerror = function () {
            console.log("Failed to load cover image for song:", songTitle);
        };
    }
}

// Function to populate song selector
function populateSongSelector() {
    const songSelector = document.getElementById("songSelector");
    songSelector.innerHTML = ""; // Clear loading message

    // Add default "Select song" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Select song.";
    songSelector.appendChild(defaultOption);

    let songsLoadedCounter = 0; // Counter for loaded songs

    songList.forEach((songPath, index) => {
        const option = document.createElement("option");
        option.value = index; // Assign the index as the option value
        option.text = getSongTitle(songPath);
        songSelector.appendChild(option);
        songsLoadedCounter++; // Increment the counter for each loaded song
    });

    songSelector.addEventListener("change", function () {
        const selectedIndex = parseInt(this.value, 10); // Convert the value to an integer
        if (isNaN(selectedIndex)) return; // If the selected value is not a number, do nothing

        const selectedSongPath = songList[selectedIndex];

        if (currentSong) {
            currentSong.pause();
            currentSong.currentTime = 0;
        }

        currentSong = new Audio(selectedSongPath);

        songStarted = false;
        notes = [];
        points = 0;
        totalMisses = 0;
        perfectHits = 0;
        earlyLateHits = 0;
        songPausedTime = null;
        BPM = 0;
        noteSpeed = 0;
        maxStreak = 0;
        currentStreak = 0;

        startGame(selectedIndex);

        songSelector.selectedIndex = 0;

        songSelector.blur();
    });
}

function nextSong() {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    // Increment currentSongIndex and loop back to 0 if it exceeds the array length
    currentSongIndex = (currentSongIndex + 1) % songList.length;

    // Start the game with the next song in the songList array
    currentSongPath = songList[currentSongIndex];
    console.log("Spinning again from index: " + currentSongIndex);
    startGame(currentSongIndex);
}

function restartSong() {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    console.log("Restarting song from index: " + currentSongIndex);
    startGame(currentSongIndex);
}

function previousSong() {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    // Decrement currentSongIndex and wrap around to the last song if it goes negative
    currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;

    // Start the game with the previous song in the songList array
    currentSongPath = songList[currentSongIndex];
    console.log("Previous song from index: " + currentSongIndex);
    startGame(currentSongIndex);
}

function pickRandomSong() {
    return songList[Math.floor(Math.random() * songList.length)];
}

function pickRandomSongIndex() {
    return Math.floor(Math.random() * songList.length);
}

function randomizeSong() {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    // Randomize song
    currentSongIndex = pickRandomSongIndex();
    console.log("Randomizing song to: " + currentSongIndex);

    // Start the game with the new random song
    startGame(currentSongIndex);
}

function resetSongVariables() {
    songStarted = false;
    notes = []; // Clear the notes array
    points = 0;
    totalMisses = 0;
    perfectHits = 0;
    earlyLateHits = 0;
    songPausedTime = null;
    BPM = 0; // Reset BPM
    noteSpeed = 0; // Reset note speed
    maxStreak = 0;
    currentStreak = 0;

    // Clear the existing interval
    if (speedUpdater) {
        clearInterval(speedUpdater);
    }

    // Reset dynamic speed variables
    dynamicSpeedInfo = "";
    nextSpeedChange = "";
    currentConfigIndex = 0;
}

function displaySongInfo() {
    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Song " + (currentSongIndex + 1) + ": " + getSongTitle(currentSong.src), WIDTH - 10, 28);
    ctx.fillText(getArtist(currentSong.src), WIDTH - 10, 56);
    ctx.font = "22px Arial";
    ctx.fillText("BPM: " + BPM + " / Speed: " + noteSpeed, WIDTH - 10, 84);
}

function getSongTitle(songPath) {
    // Ensure songPath is a string
    if (typeof songPath !== "string") {
        console.error("songPath is not a string:", songPath);
        return "Unknown Title";
    }

    // Extract the file name without the directory path
    let fileName = songPath.split("/").pop();
    // Remove the file extension
    fileName = fileName.replace(".mp3", "").replace(".jpg", "").replace("_", "'");
    // Decode the URI component
    let decodedTitle = decodeURIComponent(fileName);
    return decodedTitle;
}

function getArtist(songSrc) {
    // Define the artist for each song
    const artists = {
        Epilogue: "Creo",
        Exosphere: "Creo",
        "Die For You": "VALORANT",
        "Father Stretch My Hands": "Kanye West",
        "Betty (Get Money)": "Yung Gravy",
        "BURN IT DOWN": "Linkin Park",
        "Aleph 0": "LeaF",
        "Better Days": "LAKEY INSPIRED",
        KOCMOC: "SLEEPING HUMMINGBIRD",
        "kompa pasion": "frozy",
        "Legends Never Die": "League Of Legends",
        "Star Walkin": "League Of Legends",
        "What I've Done": "Linkin Park",
        "Biggest NCS Songs": "NoCopyrightSounds",
        Goosebumps: "Travis Scott",
        "Master Of Puppets (Live)": "Metallica",
        Numb: "Linkin Park",
        "sdp interlude": "Travis Scott",
        "Shiawase (VIP)": "Dion Timmer",
        VVV: "mikeysmind",
        "Sleepwalker X Icewhxre": "akiaura X Lumi Athena",
        "WTF 2": "Ugovhb",
        VISIONS: "VALORANT",
        "Stressed Out": "twenty one pilots",
        "Ticking Away": "VALORANT",
        "MY EYES": "Travis Scott",
        "Can't Slow Me Down": "VALORANT",
        LUNCH: "Billie Eilish",
        "Butterfly Effect": "Travis Scott",
        SWIM: "Chase Atlantic",
        "You Need Jesus": "BABY GRAVY",
        Crazy: "Creo",
        "FE!N": "Travis Scott",
        Nautilus: "Creo",
        Levitating: "Dua Lipa",
        "Somewhere I Belong": "Linkin Park",
        "From The Inside": "Linkin Park",
        Faint: "Linkin Park",
        "Breaking The Habit": "Linkin Park",
        "I Wonder": "Kanye West",
        Godzilla: "Eminem",
        Houdini: "Eminem",
        Runaway: "Kanye West",
        "Rush E": "M.J. Kelly",
        "Vamp Anthem": "Playboi Carti",
        CARNIVAL: "Kanye West",
        "HUMBLE.": "Kendrick Lamar",
        "Stop Breathing": "Playboi Carti",
        "CHEGOU 3": "shonci",
        "KRUSH ALERT": "shonci",
        BAIXO: "xxanteria",
        "MOVE YO BODY": "Bryansanon",
        "SLAY!": "Eternxlkz",
        "ROCK THAT SHIT!": "asteria",
        "CUTE DEPRESSED": "Dyan Dxddy",
        "LOOK DON'T TOUCH": "Odetari",
        "YOU'RE TOO SLOW": "Odetari",
        BAND4BAND: "Central Cee",
        "HIGHEST IN THE ROOM": "Travis Scott",
        "Slide da Treme Melódica v2": "DJ FNK",
        fantasmas: "Humbe",
        BIKE: "tanger",
        ARCANGEL: "Bizarrap",
    };
    let songTitle = getSongTitle(songSrc);
    return artists[songTitle] || "N/A";
}

// Function to get the album cover image based on the song path and rotate it
function getCover(songPath, deltaTime) {
    const songTitle = getSongTitle(songPath);
    const coverImage = loadedImages[songTitle];
    if (coverImage) {
        let centerX = WIDTH - 190 + 180 / 2;
        let centerY = 92 + 180 / 2;
        let radius = 90;

        // Calculate rotation speed and angle based on deltaTime
        let rotationSpeed = 0.015 * BPM; // Adjust rotation speed as needed
        if (vinylRotationEnabled) {
            rotationAngle += rotationSpeed * deltaTime; // Accumulate rotation angle
        }

        if (circularImageEnabled) {
            rotateImage(ctx, coverImage, centerX, centerY, radius, rotationAngle);
        } else {
            ctx.drawImage(coverImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
        }
    } else {
        let centerX = WIDTH - 190 + 180 / 2;
        let centerY = 92 + 180 / 2;
        let radius = 90;

        if (circularImageEnabled) {
            ctx.save();

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(noCover, centerX - radius, centerY - radius, radius * 2, radius * 2);

            ctx.restore();
        } else {
            ctx.drawImage(noCover, centerX - radius, centerY - radius, radius * 2, radius * 2);
        }

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "right";
        ctx.fillText("No cover found", WIDTH - 10, 294);
        ctx.fillText("for " + getSongTitle(currentSong.src), WIDTH - 10, 318);
    }
}

// Function to rotate the image
function rotateImage(ctx, coverImage, centerX, centerY, radius, rotationAngle) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);
    ctx.drawImage(coverImage, -radius, -radius, radius * 2, radius * 2);

    ctx.restore();
}

// Initialize variables
let rotationAngle = 0; // Initial rotation angle
let vinylRotationEnabled = false; // Initial rotation state
let circularImageEnabled = false; // Initial circular image state

// Toggle vinyl rotation visibility
function toggleVinylRotation() {
    const circularImageCheckbox = document.getElementById("circularImage");
    const vinylRotationContainer = document.getElementById("vinylRotationContainer");
    if (circularImageCheckbox.checked) {
        vinylRotationContainer.style.display = "block";
    } else {
        vinylRotationContainer.style.display = "none";
        document.getElementById("vinylRotation").checked = false;
        vinylRotationEnabled = false;
        rotationAngle = 0; // Reset rotation angle when disabled
    }
}

function getCoverForEndScreen(songPath) {
    const songTitle = getSongTitle(songPath);
    const coverImage = loadedImages[songTitle];
    if (coverImage) {
        let centerX = WIDTH - 100; // X-coordinate of the circle center
        let centerY = HEIGHT / 2 + 40; // Y-coordinate of the circle center
        let radius = 90; // Radius of the circle

        ctx.save();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.globalAlpha = 0.5;

        ctx.drawImage(coverImage, centerX - radius, centerY - radius, radius * 2, radius * 2);

        ctx.restore();
    } else {
        let centerX = WIDTH - 100;
        let centerY = HEIGHT / 2 + 40;
        let radius = 90;

        ctx.save();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.globalAlpha = 0.5;

        ctx.drawImage(noCover, centerX - radius, centerY - radius, radius * 2, radius * 2);

        ctx.restore();
    }
}

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
    const songSelector = document.getElementById("songSelector");
    const loadingOption = document.createElement("option");
    loadingOption.value = "";
    loadingOption.text = "Loading songs...";
    songSelector.appendChild(loadingOption);

    const songVolumeSlider = document.getElementById("songVolume");
    const hitSoundSlider = document.getElementById("hitSoundSlider");

    songVolumeSlider.value = currentSongVolume * 100;
    hitSoundSlider.value = currentHitSoundVolume * 100;

    console.log("Loaded saved song volume");
    console.log("Loaded saved hit sound volume");

    preloadSongs();
    preloadImages();
});

// Function to simulate key press
function simulateKeyPress(key) {
    // Create a new KeyboardEvent with the specified key
    var event = new KeyboardEvent("keydown", { key: key });

    // Dispatch the event to simulate the key press
    document.dispatchEvent(event);
}

window.onload = function () {
    ctx = document.getElementById("myCanvas").getContext("2d");
    document.getElementById("toggleAutoHit").addEventListener("click", toggleAutoHit);
    document.getElementById("nextButton").addEventListener("click", nextSong);
    document.getElementById("restartButton").addEventListener("click", restartSong);
    document.getElementById("previousButton").addEventListener("click", previousSong);
    document.getElementById("randomizeButton").addEventListener("click", randomizeSong);
    document.getElementById("debugButton").addEventListener("click", toggleDebugInfo);

    document.getElementById("startButton").onclick = function () {
        startGame();
    };

    // Disable the button if it's clicked once
    var startButton = document.getElementById("startButton");
    startButton.addEventListener("click", function () {
        document.getElementById("startButton").style.display = "none";
    });

    // Load settings from localStorage
    const savedBackgroundOption = localStorage.getItem("backgroundOption") || "defaultBG";
    const savedCustomBG = localStorage.getItem("customBackground");
    const savedCustomBGBlur = localStorage.getItem("customBackgroundBlur") || "0px";
    document.getElementById("backdropBlurInput").value = savedCustomBGBlur;
    document.getElementById("myCanvas").style.backdropFilter = `blur(${savedCustomBGBlur})`;

    if (savedBackgroundOption) {
        defaultBackground.value = savedBackgroundOption;
        if (savedBackgroundOption === "customBG" && savedCustomBG) {
            BGbright.src = localStorage.getItem("customBackground");
        }
    }

    defaultBackground.addEventListener("change", function () {
        const selectedOption = this.value;
        localStorage.setItem("backgroundOption", selectedOption);
        if (selectedOption === "customBG") {
            customBGLabel.style.display = "inline";
            customBGInput.style.display = "inline";
            customTransparentBGblur.style.display = "inline";
            backdropBlurInput.style.display = "inline";
        } else if (selectedOption === "transparentBG") {
            customTransparentBGblur.style.display = "inline";
            backdropBlurInput.style.display = "inline";
        } else {
            customBGLabel.style.display = "none";
            customBGInput.style.display = "none";
            customTransparentBGblur.style.display = "none";
            backdropBlurInput.style.display = "none";
        }
    });
};

console.log("Window.onload loaded.");

function togglePause() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        songPausedTime = Date.now();
        currentSong.pause();
        canvasUpdating = false;
        console.log("Game Paused");
    } else {
        let pauseDuration = Date.now() - songPausedTime;
        songStartTime += pauseDuration;
        currentSong.play();
        lastTime += pauseDuration; // Adjust lastTime to prevent jump in timeDelta
        canvasUpdating = true;
        requestAnimationFrame(updateCanvas);
        console.log("Game Unpaused");
    }
}

function startGame(index) {
    console.log("Starting game with index:", index);

    // Reset autoHitDisableSaving and autoHit when starting a new game
    autoHitDisableSaving = false;
    autoHitEnabled = false;

    // Reset the logging flag for best scores
    bestScoreLogged = {};

    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    if (typeof index === "undefined") {
        var randomSong = pickRandomSong();
        console.log("Randomly selected song:", randomSong);
        currentSongPath = randomSong;
        currentSongIndex = songList.indexOf(currentSongPath);
    } else {
        currentSongIndex = index;
        currentSongPath = songList[currentSongIndex];
    }

    currentSong = new Audio(currentSongPath);
    currentSong.volume = currentSongVolume;

    currentSong.onloadedmetadata = function () {
        console.log("Loaded selected song's metadata");

        var config = songConfigs[currentSongPath] || {
            BPM: 120,
            noteSpeed: 10,
        }; // Default values if song is not in the config
        BPM = config.BPM;
        MILLISECONDS_PER_BEAT = 60000 / BPM; // Calculate MILLISECONDS_PER_BEAT based on the BPM
        noteSpeed = config.noteSpeed;

        notes = generateRandomNotes(currentSong.duration * 1000);
        noteYPositions = {
            left: [],
            down: [],
            up: [],
            right: [],
        };

        const songTitle = getSongTitle(currentSongPath);
        const songConfig = getDynamicSpeed(currentSongPath);

        if (songConfig) {
            console.log(`Dynamic speed configuration found for "${songTitle}"`);
            dynamicSpeedInfo = songConfig.map((config) => `Timestamp: ${config.timestamp}, Speed: ${config.noteSpeed}`).join(" | ");
            let currentConfigIndex = 0; // Reset currentConfigIndex
            nextSpeedChange = ""; // Reset nextSpeedChange

            speedUpdater = setInterval(() => {
                if (currentSong && songConfig && currentConfigIndex < songConfig.length) {
                    const currentTime = currentSong.currentTime;
                    const nextConfig = songConfig[currentConfigIndex];
                    if (currentTime >= nextConfig.timestamp) {
                        noteSpeed = nextConfig.noteSpeed;
                        console.log(`Updated note speed to: ${noteSpeed} at timestamp: ${nextConfig.timestamp}`);
                        if (nextConfig.notes) {
                            notes = nextConfig.notes;
                            console.log(`Updated notes at timestamp: ${nextConfig.timestamp}`);
                        }
                        if (nextConfig.endScreenDrawn) {
                            endScreenDrawn = nextConfig.endScreenDrawn;
                            console.log(`End screen drawn at timestamp: ${nextConfig.timestamp}`);
                        }
                        currentConfigIndex++;
                    }
                    // Update next imminent speed change
                    if (currentConfigIndex < songConfig.length) {
                        const upcomingConfig = songConfig[currentConfigIndex];
                        nextSpeedChange = `Next speed change at: ${upcomingConfig.timestamp}s, Speed: ${upcomingConfig.noteSpeed}`;
                    } else {
                        nextSpeedChange = "No more speed changes.";
                    }
                } else {
                    clearInterval(speedUpdater);
                }
            }, 1);
        } else {
            console.log(`No dynamic speed configuration for "${songTitle}"`);
            dynamicSpeedInfo = "No dynamic speed configuration found.";
            nextSpeedChange = "No speed changes.";
        }

        currentSong.play(); // Start playing the song immediately
        songStartTime = Date.now();
        songStarted = true;
        gamePaused = false;
        gameStarted = true;
        endScreenDrawn = false;

        // Reset time tracking variables
        lastTime = 0;
        timeDelta = 0;

        if (!canvasUpdating) {
            canvasUpdating = true; // Set the flag to indicate the canvas is being updated
            requestAnimationFrame(updateCanvas);
        }

        console.log("Song selected: " + getSongTitle(currentSong.src), "by: " + getArtist(currentSong.src));
        console.log("Current song path:", currentSongPath);
        console.log("Beatz.io loaded and playing. Have Fun!");

        currentSong.addEventListener("ended", onSongEnd);

        document.getElementById("nextButton").style.display = "inline";
        document.getElementById("restartButton").style.display = "inline";
        document.getElementById("previousButton").style.display = "inline";
        document.getElementById("randomizeButton").style.display = "inline";
        document.getElementById("toggleNoteStyleButton").style.display = "inline";
        document.getElementById("fullscreen").style.display = "inline";
        document.getElementById("keybindsButton").style.display = "inline";
        document.getElementById("myYoutube").style.display = "inline";
        document.getElementById("songVol").style.display = "inline";
        document.getElementById("hitSoundVol").style.display = "inline";
        document.getElementById("debugButton").style.display = "inline";

        document.getElementById("startButton").style.display = "none";
    };
}

// Score logic

// Function to save the score to localStorage
function saveScore(song, points, perfects, misses, earlylates, maxstreak) {
    console.log("saveScore called with:", {
        song,
        points,
        perfects,
        misses,
        earlylates,
        maxstreak,
    });

    if (autoHitDisableSaving) {
        console.log(`Score for ${song} not saved because Auto Hit was enabled during gameplay. Don't cheat!`);
        return;
    }

    const score = {
        points: points,
        perfects: perfects,
        misses: misses,
        earlylates: earlylates,
        maxstreak: maxstreak,
    };

    try {
        // Retrieve existing score from localStorage
        const existingScoreStr = localStorage.getItem(song);
        if (existingScoreStr) {
            const existingScore = JSON.parse(existingScoreStr);
            // Check if new score's points are higher than existing score's points
            if (points > existingScore.points) {
                // Update localStorage with new score
                localStorage.setItem(song, JSON.stringify(score));
                console.log(`New best score for ${song} saved to localStorage. Even better than before! Nice!`);
            } else if (maxstreak === 0) {
                console.log(`You went AFK for the entire ${song} duration, score has not been saved.`);
            } else if (points === 0) {
                console.log(`how do you manage to get 0 points`);
            } else {
                console.log(`Score for ${song} is not higher than existing best score, score has not been saved.`);
            }
        } else {
            // If no existing score, save the new score
            localStorage.setItem(song, JSON.stringify(score));
            console.log(`Score for ${song} saved to localStorage as the first best score. Nice!`);
        }
    } catch (e) {
        console.error(`Error saving score for ${song} to localStorage:`, e);
    }
}

// Function to get the best score from localStorage
function getBestScore(song) {
    const score = localStorage.getItem(song);
    if (score) {
        if (!bestScoreLogged[song]) {
            console.log(`Best score for ${song} retrieved from localStorage.`);
            bestScoreLogged[song] = true; // Set the flag to true for this song
        }
        return JSON.parse(score);
    } else {
        if (!bestScoreLogged[song]) {
            console.log(`No best score for ${song} found in localStorage.`);
            bestScoreLogged[song] = true; // Set the flag to true for this song
        }
    }
    return null;
}

// Function to display the best score
function displayBestScore(song) {
    const bestScore = getBestScore(song);
    if (bestScore) {
        ctx.fillStyle = "white";
        ctx.font = "25px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`Best Score: ${bestScore.points}`, WIDTH - 10, HEIGHT - 10);
        ctx.font = "15px Arial";
        ctx.fillText(`Most Perfects: ${bestScore.perfects}`, WIDTH - 10, HEIGHT - 35);
        ctx.fillText(`Most Early/Late Hits: ${bestScore.earlylates}`, WIDTH - 10, HEIGHT - 55);
        ctx.fillText(`Most Misses: ${bestScore.misses}`, WIDTH - 10, HEIGHT - 75);
        ctx.fillText(`Max Streak: ${bestScore.maxstreak}`, WIDTH - 10, HEIGHT - 95);
    }
}

// Logic to activate when the song ends
function onSongEnd() {
    let songName = getSongTitle(currentSong.src);

    try {
        saveScore(songName, points, perfectHits, totalMisses, earlyLateHits, maxStreak);
    } catch (error) {
        console.error("Song ending error:", error);
    }

    if (restartSongTimeout) {
        console.log("Restarting song in ", songTimeoutDelay / 1000, " seconds...");
        setTimeout(() => {
            restartSong();
        }, songTimeoutDelay); // Delay specified in settings
    }

    console.log("Parameters to save:", songName, points, perfectHits, totalMisses, earlyLateHits, maxStreak);

    drawEndScreen();
}

// Function to check and display the best score if the selected song has one
function checkAndDisplayBestScore() {
    if (currentSong && currentSong.src) {
        const songName = getSongTitle(currentSong.src);
        displayBestScore(songName);
    } else {
        console.log("currentSong or currentSong.src is not defined.");
    }
}

// Endscreen
function drawEndScreen() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    canvasUpdating = false;

    endScreenDrawn = true;

    if (backgroundIsntDefault) {
        ctx.drawImage(BGbright, 0, 0, 1280, 720);
    }

    // Draw "Song completed!" text
    ctx.fillStyle = "white";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Song completed!", WIDTH / 2, HEIGHT / 2 - 150);

    // Draw song information
    getCoverForEndScreen(currentSongPath);
    ctx.font = "30px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Song: " + getSongTitle(currentSongPath), WIDTH - 100, HEIGHT / 2);
    ctx.fillText("Artist: " + getArtist(currentSongPath), WIDTH - 100, HEIGHT / 2 + 40);
    ctx.fillText("BPM: " + BPM, WIDTH - 100, HEIGHT / 2 + 80);
    ctx.fillText("Speed: " + noteSpeed, WIDTH - 100, HEIGHT / 2 + 120);

    // Draw statistical information
    ctx.textAlign = "left";
    ctx.fillText("Points: " + points, 100, HEIGHT / 2);
    ctx.fillText("Perfect Hits: " + perfectHits, 100, HEIGHT / 2 + 40);
    ctx.fillText("Early/Late Hits: " + earlyLateHits, 100, HEIGHT / 2 + 80);
    ctx.fillText("Misses: " + totalMisses, 100, HEIGHT / 2 + 120);

    // Draw maximum streak
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Maximum streak: " + maxStreak, WIDTH / 2, HEIGHT / 2 + 200);
}

console.log("Functions saveScore, getBestScore, displayBestScore, and onSongEnd loaded.");

console.log("Ready to start Beatz.");

let gamePaused = false;
let pausedTextDrawn = false;
let endScreenDrawn = false;

// Initialize variables for time tracking
let lastTime = 0;
let timeDelta = 0;
let lastFrameTime = 0;
let fps = 0;

let debugInfoVisible = false;

// Function to toggle debug info visibility
function toggleDebugInfo() {
    debugInfoVisible = !debugInfoVisible;
}

let newestNoteType = "";
let newestNoteTime = 0;

function updateDebugInfo(deltaTime, timestamp) {
    if (debugInfoVisible) {
        const lineHeight = 20; // Adjust this based on your font size and line spacing
        const startY = HEIGHT / 2 - 180; // Starting y-coordinate for the first text
        const left = parseFloat(noteYPositions.left);
        const up = parseFloat(noteYPositions.up);
        const down = parseFloat(noteYPositions.down);
        const right = parseFloat(noteYPositions.right);

        // Calculate FPS
        let currentFPS = 1 / deltaTime;
        fps = currentFPS.toFixed(1);

        ctx.font = "12px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText(`Version: ${VERSION}`, 10, startY);
        ctx.fillText(`Delta Time: ${deltaTime.toFixed(3)} seconds`, 10, startY + lineHeight);
        ctx.fillText(`Timestamp: ${timestamp} milliseconds`, 10, startY + 2 * lineHeight);
        ctx.fillText(`Current FPS: ${fps}`, 10, startY + 3 * lineHeight);
        ctx.fillText(`Current song path: ${currentSongPath}`, 10, startY + 4 * lineHeight);
        ctx.fillText(`Current song source:`, 10, startY + 5 * lineHeight);
        ctx.fillText(`${currentSong.src}`, 10, startY + 6 * lineHeight);
        ctx.fillText(`Hit sound index: ${currentHitSoundIndex}`, 10, startY + 7 * lineHeight);
        ctx.fillText(`Song start time: ${songStartTime}`, 10, startY + 8 * lineHeight);
        ctx.fillText(`Song paused time: ${songPausedTime}`, 10, startY + 9 * lineHeight);
        ctx.fillText(`Newest note: ${newestNoteType}, at timestamp: ${newestNoteTime.toFixed(3)}`, 10, startY + 10 * lineHeight);
        ctx.fillText(`Note Y positions: ${left.toFixed(1)} | ${up.toFixed(1)} | ${down.toFixed(1)} | ${right.toFixed(1)}`, 10, startY + 11 * lineHeight);
        ctx.fillText(`Last perfect note type: ${lastPerfectHitNoteType}`, 10, startY + 12 * lineHeight);
        ctx.fillText(`Last early/late note type: ${lastEarlyLateNoteType}`, 10, startY + 13 * lineHeight);
        ctx.fillText(`Last note type: ${lastNoteType}`, 10, startY + 14 * lineHeight);
        ctx.fillText(`Total notes hit in this playthrough: ${notesHit}`, 10, startY + 15 * lineHeight);
        ctx.fillText(`Auto hit disabled saving? ${autoHitDisableSaving}`, 10, startY + 16 * lineHeight);
        ctx.fillText(`Dynamic speeds for ${getSongTitle(currentSongPath)}: ${dynamicSpeedInfo}`, 10, startY + 17 * lineHeight);
        ctx.fillText(nextSpeedChange, 10, startY + 18 * lineHeight);
    }
}

let backgroundIsntDefault = true; // Default to true assuming default background

function updateCanvas(timestamp) {
    if (!lastTime) {
        lastTime = timestamp;
    }

    // Calculate the time difference between frames
    timeDelta = (timestamp - lastTime) / 1000; // timeDelta in seconds
    lastTime = timestamp;

    if (gamePaused) {
        // Calculate the time difference between frames
        let timeDelta = (timestamp - lastTime) / 1000; // timeDelta in seconds
        lastTime = timestamp;

        if (!pausedTextDrawn) {
            // Draw "Game Paused" text
            ctx.fillStyle = "red";
            ctx.font = "60px Arial";
            ctx.textAlign = "center";
            const textX = WIDTH / 2;
            ctx.fillText("Game Paused", textX, HEIGHT / 2);
            pausedTextDrawn = true;
        }
        return;
    }
    if (endScreenDrawn === true) {
        onSongEnd();
        return;
    }

    endScreenDrawn = false;

    pausedTextDrawn = false;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (backgroundIsntDefault) {
        ctx.drawImage(BGbright, 0, 0, 1280, 720);
    }

    ctx.drawImage(noteLeftIMG, noteXPositions.left - noteWidth / 2, 550, noteWidth, noteHeight);
    ctx.drawImage(noteUpIMG, noteXPositions.up - noteWidth / 2 + 15, 550, noteWidth, noteHeight);
    ctx.drawImage(noteDownIMG, noteXPositions.down - noteWidth / 2 - 15, 550, noteWidth, noteHeight);
    ctx.drawImage(noteRightIMG, noteXPositions.right - noteWidth / 2, 550, noteWidth, noteHeight);

    if (isNewPlayer) {
        switch (tutorialStage) {
            case 0:
                ctx.fillText(keybindsText.initial.left, noteXPositions.left + 8, 540);
                ctx.fillText(keybindsText.initial.up, noteXPositions.up + 24, 540);
                ctx.fillText(keybindsText.initial.down, noteXPositions.down - 8, 540);
                ctx.fillText(keybindsText.initial.right, noteXPositions.right + 8, 540);
                break;
            case 1:
                ctx.textAlign = "center";
                ctx.fillText(keybindsText.customizable, WIDTH / 2, 510);
                break;
            case 2:
                ctx.textAlign = "center";
                ctx.fillText(keybindsText.followMe.announce, WIDTH / 2, 510);
                break;
            case 3:
                ctx.textAlign = "center";
                ctx.fillText(keybindsText.followMe.twitter, WIDTH / 2, 510);
                break;
            case 4:
                ctx.textAlign = "center";
                ctx.fillText(keybindsText.followMe.yt, WIDTH / 2, 510);
                break;
            case 5:
                ctx.textAlign = "center";
                ctx.fillText(keybindsText.thankYou, WIDTH / 2, 510);
                break;
            case 6:
                break;
        }
    }

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Points: " + points, 10, 35);
    ctx.fillText("Total Misses: " + totalMisses, 10, 75);
    ctx.fillText("Perfects: " + perfectHits, 10, 115);
    ctx.fillText("Early/Late: " + earlyLateHits, 10, 155);

    ctx.fillStyle = "white";
    ctx.font = "13px Arial";
    ctx.textAlign = "center";
    ctx.fillText(PUBLICVERSION, WIDTH / 2, HEIGHT - 6);

    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("" + currentStreak, WIDTH / 2, HEIGHT / 2 - 120);
    ctx.font = "15px Arial";
    ctx.fillText("( " + maxStreak + " )", WIDTH / 2, HEIGHT / 2 - 160);

    if (perfectText.active) {
        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Perfect!", WIDTH / 2, textY - 10); // Aligned to the middle
        perfectText.timer -= 16; // Decrease timer
        if (perfectText.timer <= 0) {
            perfectText.active = false; // Disable perfect text when timer runs out
        }
    }

    if (earlyLateText.active) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "right";
        ctx.fillText("Almost!", WIDTH / 2 + 200, textY - 10); // Aligned to the middle right-hand side
        earlyLateText.timer -= 16; // Decrease timer
        if (earlyLateText.timer <= 0) {
            earlyLateText.active = false; // Disable early/late text when timer runs out
        }
    }

    if (missText.active) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Miss...", WIDTH / 2 - 200, textY - 10); // Aligned to the middle left-hand side
        missText.timer -= 16; // Decrease timer
        if (missText.timer <= 0) {
            missText.active = false; // Disable missed hit text when timer runs out
        }
    }

    displaySongInfo();
    getCover(currentSongPath, timeDelta);

    if (songStarted) {
        let currentTime = Date.now() - songStartTime;

        // Spawn notes based on timestamps
        for (let i = 0; i < notes.length; i++) {
            let note = notes[i];
            if (note.time <= currentTime && note.time + 1000 > currentTime) {
                if (noteYPositions[note.type].length === 0 || HEIGHT - noteYPositions[note.type][noteYPositions[note.type].length - 1] >= MIN_NOTE_GAP) {
                    noteYPositions[note.type].push(-noteHeight);

                    newestNoteType = note.type;
                    newestNoteTime = note.time;
                }
            }
        }

        // Move and draw moving notes
        moveNotes(timeDelta);

        for (let type in noteYPositions) {
            for (let yPos of noteYPositions[type]) {
                let xPos = noteXPositions[type];
                switch (type) {
                    case "left":
                        ctx.drawImage(noteLeftIMG, xPos - noteWidth / 2, yPos, noteWidth, noteHeight);
                        break;
                    case "up":
                        ctx.drawImage(noteUpIMG, xPos - noteWidth / 2 + 15, yPos, noteWidth, noteHeight);
                        break;
                    case "down":
                        ctx.drawImage(noteDownIMG, xPos - noteWidth / 2 - 15, yPos, noteWidth, noteHeight);
                        break;
                    case "right":
                        ctx.drawImage(noteRightIMG, xPos - noteWidth / 2, yPos, noteWidth, noteHeight);
                        break;
                }
            }
        }

        // Automatically hit notes in the perfect range if enabled
        if (autoHitEnabled) {
            autoHitPerfectNotes();
        }

        // Check if keys are pressed and reset note positions if within the hit range
        checkHits();

        // Check for missed notes
        checkMisses();

        // Call the function to check and display the best score for the current song
        checkAndDisplayBestScore();

        // Update debug info on the canvas
        updateDebugInfo(timeDelta, timestamp);

        // Display "Auto Hit: On" text if auto-hit is enabled
        if (autoHitEnabled) {
            drawAutoHitText();
        }
    }
    requestAnimationFrame(updateCanvas);
}

function updateNotes(timeDelta) {
    for (let i = 0; i < notes.length; i++) {
        notes[i].y += noteSpeed * timeDelta * 60; // Multiply by 60 to scale with the base frame rate
        if (notes[i].y > HEIGHT) {
            notes.splice(i, 1);
            i--;
        }
    }
}

function moveNotes(timeDelta) {
    for (let type in noteYPositions) {
        for (let i = 0; i < noteYPositions[type].length; i++) {
            noteYPositions[type][i] += noteSpeed * timeDelta * 60; // Multiply by 60 to scale with the base frame rate
        }
        noteYPositions[type] = noteYPositions[type].filter((yPos) => yPos <= HEIGHT);
    }
    updateNotes(timeDelta);
}

function autoHitPerfectNotes() {
    for (let type in noteYPositions) {
        for (let i = 0; i < noteYPositions[type].length; i++) {
            let yPos = noteYPositions[type][i];
            if (yPos >= 540) {
                triggerHit(type);
                points = -1;
                perfectHits = -1;
                totalMisses = 0;
                earlyLateHits = 0;
                break;
            }
        }
    }
}

function triggerHit(type) {
    if (type === "up") {
        upPressed = true;
        setTimeout(() => {
            upPressed = false;
        }, 100);
    } else if (type === "down") {
        downPressed = true;
        setTimeout(() => {
            downPressed = false;
        }, 100);
    } else if (type === "left") {
        leftPressed = true;
        setTimeout(() => {
            leftPressed = false;
        }, 100);
    } else if (type === "right") {
        rightPressed = true;
        setTimeout(() => {
            rightPressed = false;
        }, 100);
    }
}

function checkHits() {
    if (leftPressed) {
        let xPos = noteXPositions.left;
        ctx.drawImage(noteLeftPressIMG, xPos - noteWidth / 2, 550, noteWidth, noteHeight);
        checkHit("left");
    }
    if (downPressed) {
        let xPos = noteXPositions.down;
        ctx.drawImage(noteDownPressIMG, xPos - noteWidth / 2 - 15, 550, noteWidth, noteHeight);
        checkHit("down");
    }
    if (upPressed) {
        let xPos = noteXPositions.up;
        ctx.drawImage(noteUpPressIMG, xPos - noteWidth / 2 + 15, 550, noteWidth, noteHeight);
        checkHit("up");
    }
    if (rightPressed) {
        let xPos = noteXPositions.right;
        ctx.drawImage(noteRightPressIMG, xPos - noteWidth / 2, 550, noteWidth, noteHeight);
        checkHit("right");
    }
}

var currentHitSoundIndex = 0; // Keep track of the last played hit sound

function checkHit(noteType) {
    for (let i = 0; i < noteYPositions[noteType].length; i++) {
        let yPos = noteYPositions[noteType][i];
        if (yPos >= HIT_Y_RANGE_MIN && yPos <= HIT_Y_RANGE_MAX) {
            if (yPos >= 540 && yPos <= 560) {
                // Perfect hit range
                points += 1; // Increment by 1 point for perfect hit
                perfectHits++;
                perfectText.active = true; // Enable perfect text
                perfectText.timer = 500; // Set timer for perfect text (0.5 seconds)
                lastPerfectHitNoteType = noteType; // Store the last perfect hit note type

                // Trigger animation on perfect hit
                notePulsing = true;
                // Set a timer to stop the animation after 0.25 seconds (250 milliseconds)
                setTimeout(() => {
                    notePulsing = false;
                }, 200);
            } else {
                // Early or late hit range
                points += 0.5; // Increment by 0.5 points for early or late hit
                earlyLateHits++;
                earlyLateText.active = true; // Enable early/late text
                earlyLateText.timer = 500; // Set timer for early/late text (0.5 seconds)
                lastEarlyLateNoteType = noteType;
            }

            // Update streaks
            currentStreak++;
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }

            notesHit++;
            if (notesHit === 4) {
                tutorialStage = 1;
                cycleTutorialStages();
            }

            lastNoteType = noteType;

            noteYPositions[noteType].splice(i, 1);
            let hitSound = hitSounds[currentHitSoundIndex];
            hitSound.currentTime = 0;
            hitSound.play();
            hitSound.volume = currentHitSoundVolume;
            currentHitSoundIndex = (currentHitSoundIndex + 1) % MAX_HIT_SOUNDS;
            break;
        }
    }
}

function cycleTutorialStages() {
    if (tutorialStage < 6) {
        const interval = tutorialStage === 2 || tutorialStage === 3 || tutorialStage === 4 ? 2500 : 5000;
        setTimeout(() => {
            tutorialStage++;
            cycleTutorialStages();
        }, interval);
    } else if (tutorialStage === 6) {
        setTimeout(() => {
            tutorialStage = 0;
            isNewPlayer = false; // End the tutorial after the final message
        }, 5000);
    }
}

function checkMisses() {
    for (let type in noteYPositions) {
        for (let i = 0; i < noteYPositions[type].length; i++) {
            let yPos = noteYPositions[type][i];
            if (yPos > HIT_Y_RANGE_MAX + 90) {
                noteYPositions[type].splice(i, 1);
                totalMisses++; // Increment total misses when a note is missed
                points--;

                // Reset current streak
                currentStreak = 0;

                missText.active = true; // Enable missed hit text
                missText.timer = 500; // Set timer for missed hit text (0.5 seconds)
                break;
            }
        }
    }
}

function toggleAutoHit() {
    autoHitEnabled = !autoHitEnabled;
    console.log("Auto Hit", autoHitEnabled ? "Enabled" : "Disabled");

    // Set autoHitDisableSaving to true when autoHit is enabled
    if (autoHitEnabled) {
        autoHitDisableSaving = true;
        console.log("SCORE SAVING DISABLED.");
    }
}

function drawAutoHitText() {
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Auto Hit: On", 10, HEIGHT - 34);
    ctx.fillText("Points are disabled for this playthrough.", 10, HEIGHT - 10);
}

function generateRandomNotes(duration) {
    console.log("Generating notes for duration:", duration);
    const notes = [];
    const noteTypes = ["left", "down", "up", "right"];
    let lastNoteTime = -MIN_NOTE_GAP;
    let lastNoteType = null;

    for (let time = 0; time < duration; time += MILLISECONDS_PER_BEAT) {
        let type;
        do {
            type = noteTypes[Math.floor(Math.random() * noteTypes.length)];
        } while (type === lastNoteType && time - lastNoteTime < MIN_NOTE_GAP); // Ensure no two notes of the same type spawn too close to each other
        notes.push({ type, time });
        lastNoteTime = time;
        lastNoteType = type;
    }
    console.log("Generated notes:", notes);
    return notes;
}

// SETTINGS

var canvas = document.getElementById("myCanvas");
document.addEventListener("DOMContentLoaded", function () {
    detectAndHandleDevice();
    loadKeybinds();
    applyDefaultNoteStyle();
    updateKeybindsFields();
    toggleNoteStyleButtonDisplay();
    toggleTimeoutInput();
});

function toggleNoteStyleButtonDisplay() {
    const toggleNoteStyleButton = document.getElementById("toggleNoteStyleButton");
    const currentNoteStyle = localStorage.getItem("noteStyle") || "arrows";

    if (currentNoteStyle === "arrows") {
        toggleNoteStyleButton.innerHTML = '<i class="fa-solid fa-arrow-up" style="display: none;"></i> <i class="fa-solid fa-circle"></i>';
    } else {
        toggleNoteStyleButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i> <i class="fa-solid fa-circle" style="display: none;"></i>';
    }
}

document.addEventListener("keydown", keyDownFunction);
document.addEventListener("keyup", keyUpFunction);

function detectDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Checks for iOS devices
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    // Checks for Android devices
    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // Checks for other mobile devices
    if (/Mobile|iP(hone|od)|IEMobile|Windows Phone|kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        return "Mobile";
    }

    // Default to desktop
    return "Desktop";
}

function detectAndHandleDevice() {
    const deviceType = detectDeviceType();
    if (deviceType === "Mobile" || deviceType === "iOS" || deviceType === "Android") {
        // Deactivate buttons
        document.querySelectorAll("button").forEach((button) => (button.disabled = true));
        document.querySelectorAll("select").forEach((select) => (select.disabled = true));

        // Remove canvas background image
        canvas.style.backgroundimage = "";

        // Display unsupported message
        document.getElementById("unsupportedMessage").style.display = "block";

        console.log("Mobile device detected. Game is not supported.");
    } else {
        console.log("Desktop device detected. Game is supported.");
    }
}

document.getElementById("undoKeybindsButton").addEventListener("click", undoKeybinds);
document.getElementById("redoKeybindsButton").addEventListener("click", redoKeybinds);

function NewTab() {
    window.open("https://www.youtube.com/@GuayabR", "_blank");
}

function email() {
    window.open("mailto:antonviloriavictorgabriel@gmail.com");
}

function toVersion() {
    window.location.href = "BeatzGameTesting.html";
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch((err) => {
            console.log("Error attempting to enable full-screen mode: ${err.message} (${err.name})");
        });
        console.log("Entered Fullscreen");
    } else {
        document.exitFullscreen();
        console.log("Exited Fullscreen");
    }
}

document.addEventListener("fullscreenchange", function () {
    if (document.fullscreenElement) {
        canvas.style.cursor = "none";
    } else {
        canvas.style.cursor = "default";
    }
});

var modal = document.getElementById("keybindsModal");
var btn = document.getElementById("keybindsButton");
var span = document.getElementsByClassName("close")[0];
var resetButton = document.getElementById("resetKeybindsButton");
const saveMessage = document.getElementById("settingsSaved");

function convertToLowerCase(inputElement) {
    inputElement.value = inputElement.value.toLowerCase();
}
document.querySelectorAll('input[type="text"]').forEach(function (input) {
    input.addEventListener("input", function () {
        convertToLowerCase(input);
        hideSaveMessage();
    });
});

function hideSaveMessage() {
    saveMessage.style.display = "none";
}

btn.onclick = function () {
    openModal();
};

span.onclick = function () {
    closeModal();
};

window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
};

resetButton.onclick = function () {
    resetKeybinds();
};

function openModal() {
    modal.style.display = "block";
    loadKeybinds();
    deactivateKeybinds();
}

function closeModal() {
    modal.style.display = "none";
    saveMessage.style.display = "none";
    activateKeybinds();
}

document.addEventListener("keydown", function (event) {
    if (modal.style.display === "block") {
        if (event.key === "P" || event.key === "p") {
            event.stopPropagation();
            console.log("P key pressed. Modal is already open, no action taken.");
        } else if (event.key === "Escape" || event.key === "escape") {
            closeModal();
            console.log("Escape key pressed. Modal closed.");
        }
        return; // Exit the function after handling keys when modal is open
    }

    if (event.key === "P" || event.key === "p") {
        openModal();
        console.log("P key pressed. Modal opened.");
    } else if (event.key === "Escape" || event.key === "escape") {
        closeModal();
        console.log("Escape key pressed. Modal closed.");
    }
});

function deactivateKeybinds() {
    document.removeEventListener("keydown", keyDownFunction);
    document.removeEventListener("keyup", keyUpFunction);
    document.addEventListener("keydown", filterKeys);
}

function activateKeybinds() {
    document.removeEventListener("keydown", filterKeys);
    document.addEventListener("keydown", keyDownFunction);
    document.addEventListener("keyup", keyUpFunction);
}

function filterKeys(event) {
    if (event.key === "Enter" || event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
        saveKeybinds();
        console.log("Enter key pressed. Settings saved.");
    }
}

const defaultKeybinds = {
    up: ["w"],
    left: ["a"],
    down: ["s"],
    right: ["d"],
    pause: ["escape"],
    autoHit: ["1"],
    previous: ["q"],
    restart: ["r"],
    next: ["e"],
    randomize: ["t"],
    toggleNoteStyle: ["c"],
    fullscreen: ["f"],
    debug: ["control"],
    noteStyle: "arrows",
    songTimeoutAfterSongEnd: false,
    songTimeoutDelay: 5000,
    vinylRotation: false,
    circularImage: false,
    backgroundOption: "defaultBG",
    customBackgroundBlur: "0px",
    customBackground: "",
};

let keybinds = { ...defaultKeybinds };
let keybindsHistory = [];
let keybindsIndex = -1;

function loadKeybinds() {
    const savedKeybinds = JSON.parse(localStorage.getItem("keybinds")) || {};
    const savedNoteStyle = localStorage.getItem("noteStyle") || defaultKeybinds.noteStyle;
    const songTimeoutAfterSongEnd = JSON.parse(localStorage.getItem("songTimeoutAfterSongEnd")) || defaultKeybinds.songTimeoutAfterSongEnd;
    const savedSongTimeoutDelay = parseInt(localStorage.getItem("songTimeoutDelay")) || defaultKeybinds.songTimeoutDelay;
    const savedVinylRotation = JSON.parse(localStorage.getItem("vinylRotation")) || defaultKeybinds.vinylRotation;
    const savedCircularImage = JSON.parse(localStorage.getItem("circularImage")) || defaultKeybinds.circularImage;
    const savedBackgroundOption = localStorage.getItem("backgroundOption") || defaultKeybinds.backgroundOption;
    const savedCustomBackground = localStorage.getItem("customBackground") || defaultKeybinds.customBackground;
    const savedCustomBackgroundBlur = localStorage.getItem("customBackgroundBlur") || defaultKeybinds.customBackgroundBlur;

    // Merge saved keybinds with default keybinds
    keybinds = { ...defaultKeybinds, ...savedKeybinds };

    document.getElementById("songTimeoutAfterSongEnd").checked = songTimeoutAfterSongEnd;
    restartSongTimeout = songTimeoutAfterSongEnd;

    document.getElementById("circularImage").checked = savedCircularImage;
    circularImageEnabled = savedCircularImage;
    toggleVinylRotation(); // Update UI based on circularImage setting

    const vinylRotationCheckbox = document.getElementById("vinylRotation");
    vinylRotationCheckbox.checked = savedVinylRotation;
    vinylRotationEnabled = savedVinylRotation;

    const defaultNoteStyleDropdown = document.getElementById("defaultNoteStyle");
    defaultNoteStyleDropdown.value = savedNoteStyle;

    document.getElementById("up").value = keybinds.up.join(", ");
    document.getElementById("left").value = keybinds.left.join(", ");
    document.getElementById("down").value = keybinds.down.join(", ");
    document.getElementById("right").value = keybinds.right.join(", ");
    document.getElementById("pause").value = keybinds.pause.join(", ");
    document.getElementById("autoHit").value = keybinds.autoHit.join(", ");
    document.getElementById("previousInput").value = keybinds.previous.join(", ");
    document.getElementById("restartInput").value = keybinds.restart.join(", ");
    document.getElementById("nextInput").value = keybinds.next.join(", ");
    document.getElementById("randomize").value = keybinds.randomize.join(", ");
    document.getElementById("toggleNoteStyleInput").value = keybinds.toggleNoteStyle.join(", ");
    document.getElementById("fullscreenInput").value = keybinds.fullscreen.join(", ");
    document.getElementById("debugInput").value = keybinds.debug.join(", ");
    document.getElementById("songTimeoutAfterSongEndNum").value = savedSongTimeoutDelay;
    document.getElementById("circularImage").value = savedCircularImage;
    document.getElementById("vinylRotation").value = savedVinylRotation;

    // Load background settings
    document.getElementById("defaultBackground").value = savedBackgroundOption;
    document.getElementById("backdropBlurInput").value = savedCustomBackgroundBlur;
    document.getElementById("myCanvas").style.backdropFilter = `blur(${savedCustomBackgroundBlur})`;

    if (savedBackgroundOption === "customBG") {
        document.getElementById("customBGLabel").style.display = "inline";
        document.getElementById("customBGInput").style.display = "inline";
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
        if (savedCustomBackground) {
            customBG = new Image();
            customBG.src = savedCustomBackground;
        }
    } else if (savedBackgroundOption === "transparentBG") {
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
    } else {
        document.getElementById("customBGLabel").style.display = "none";
        document.getElementById("customBGInput").style.display = "none";
        document.getElementById("customTransparentBGblur").style.display = "none";
        document.getElementById("backdropBlurInput").style.display = "none";
    }

    // Set backgroundIsntDefault based on the loaded background option
    backgroundIsntDefault = savedBackgroundOption !== "transparentBG" && savedBackgroundOption !== "customBG";

    // Apply the background based on the saved option
    switch (savedBackgroundOption) {
        case "defaultBG":
            BGbright.src = "Resources/Background2.png";
            break;
        case "defaultBG2":
            BGbright.src = "Resources/Background3.jpg";
            break;
        case "defaultBG3":
            BGbright.src = "Resources/Background4.png";
            break;
        case "htmlBG":
            BGbright.src = "Resources/BackgroundHtml2.png";
            break;
        case "transparentBG":
            document.getElementById("myCanvas").style.background = "transparent";
            backgroundIsntDefault = false;
            break;
        case "customBG":
            if (savedCustomBackground) {
                BGbright.src = savedCustomBackground;
            }
            document.getElementById("myCanvas").style.backdropFilter = `blur(${savedCustomBackgroundBlur})`;
            break;
        default:
            document.getElementById("myCanvas").style.backgroundColor = "";
            backgroundIsntDefault = true;
    }

    // Update the songTimeoutDelay in the keybinds
    keybinds.songTimeoutDelay = savedSongTimeoutDelay;
    keybinds.backgroundOption = savedBackgroundOption;
    keybinds.customBackground = savedCustomBackground;
    keybinds.customBackgroundBlur = savedCustomBackgroundBlur;

    console.log("Loaded settings", keybinds);
}

// Function to read the currently selected file as a data URL
function getFileDataUrl(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result);
    };
    reader.readAsDataURL(file);
}

function saveKeybinds() {
    const newKeybinds = {
        up: document
            .getElementById("up")
            .value.split(", ")
            .map((key) => key.trim()),
        left: document
            .getElementById("left")
            .value.split(", ")
            .map((key) => key.trim()),
        down: document
            .getElementById("down")
            .value.split(", ")
            .map((key) => key.trim()),
        right: document
            .getElementById("right")
            .value.split(", ")
            .map((key) => key.trim()),
        pause: document
            .getElementById("pause")
            .value.split(", ")
            .map((key) => key.trim()),
        autoHit: document
            .getElementById("autoHit")
            .value.split(", ")
            .map((key) => key.trim()),
        previous: document
            .getElementById("previousInput")
            .value.split(", ")
            .map((key) => key.trim()),
        restart: document
            .getElementById("restartInput")
            .value.split(", ")
            .map((key) => key.trim()),
        next: document
            .getElementById("nextInput")
            .value.split(", ")
            .map((key) => key.trim()),
        randomize: document
            .getElementById("randomize")
            .value.split(", ")
            .map((key) => key.trim()),
        toggleNoteStyle: document
            .getElementById("toggleNoteStyleInput")
            .value.split(", ")
            .map((key) => key.trim()),
        fullscreen: document
            .getElementById("fullscreenInput")
            .value.split(", ")
            .map((key) => key.trim()),
        debug: document
            .getElementById("debugInput")
            .value.split(", ")
            .map((key) => key.trim()),
        noteStyle: document.getElementById("defaultNoteStyle").value,
        songTimeoutAfterSongEnd: document.getElementById("songTimeoutAfterSongEnd").checked,
        songTimeoutDelay: parseInt(document.getElementById("songTimeoutAfterSongEndNum").value) || defaultKeybinds.songTimeoutDelay,
        vinylRotation: document.getElementById("vinylRotation").checked,
        circularImage: document.getElementById("circularImage").checked,
        backgroundOption: document.getElementById("defaultBackground").value,
        customBackgroundBlur: document.getElementById("backdropBlurInput").value,
    };

    if (vinylRotationEnabled && !newKeybinds.vinylRotation) {
        rotationAngle = 0; // Reset rotation angle to 0 if rotation is disabled
    }

    restartSongTimeout = newKeybinds.songTimeoutAfterSongEnd;
    vinylRotationEnabled = newKeybinds.vinylRotation;
    circularImageEnabled = newKeybinds.circularImage;

    const timeoutInputValue = newKeybinds.songTimeoutDelay;

    if (isNaN(timeoutInputValue)) {
        alert("Please enter a valid number for the timeout delay.");
        return;
    }
    if (timeoutInputValue > 15000) {
        alert("Please enter a number that is below 15,000.");
        return;
    }

    // Validate and format blur input
    const blurInput = newKeybinds.customBackgroundBlur;
    const blurValue = parseInt(blurInput, 10);
    if (isNaN(blurValue) || blurValue < 0 || blurValue >= 1000) {
        alert("Please enter a valid number for the background blur (0-999).");
        return;
    }

    newKeybinds.customBackgroundBlur = blurValue + "px";

    const customBGInput = document.getElementById("customBGInput");
    const file = customBGInput.files[0]; // Assuming single file upload

    // Set backgroundIsntDefault based on the selected background option
    backgroundIsntDefault = newKeybinds.backgroundOption !== "transparentBG" && newKeybinds.backgroundOption !== "customBG";

    // Save changes to localStorage
    keybinds = newKeybinds;

    localStorage.setItem("keybinds", JSON.stringify(newKeybinds));
    localStorage.setItem("noteStyle", newKeybinds.noteStyle);
    localStorage.setItem("songTimeoutAfterSongEnd", JSON.stringify(newKeybinds.songTimeoutAfterSongEnd));
    localStorage.setItem("songTimeoutDelay", newKeybinds.songTimeoutDelay);
    localStorage.setItem("vinylRotation", JSON.stringify(newKeybinds.vinylRotation));
    localStorage.setItem("circularImage", JSON.stringify(newKeybinds.circularImage));
    localStorage.setItem("backgroundOption", newKeybinds.backgroundOption);
    localStorage.setItem("customBackgroundBlur", newKeybinds.customBackgroundBlur);

    // Apply the background immediately based on selection
    switch (newKeybinds.backgroundOption) {
        case "defaultBG":
            BGbright.src = "Resources/Background2.png";
            break;
        case "defaultBG2":
            BGbright.src = "Resources/Background3.jpg";
            break;
        case "defaultBG3":
            BGbright.src = "Resources/Background4.png";
            break;
        case "htmlBG":
            BGbright.src = "Resources/BackgroundHtml2.png";
            break;
        case "transparentBG":
            document.getElementById("myCanvas").style.background = "transparent";
            backgroundIsntDefault = false;
            break;
        case "customBG":
            document.getElementById("myCanvas").style.backdropFilter = `blur(${newKeybinds.customBackgroundBlur})`;
            break;
        default:
            document.getElementById("myCanvas").style.backgroundColor = "";
            backgroundIsntDefault = true;
    }

    if (newKeybinds.backgroundOption !== "customBG") {
        localStorage.setItem("customBackground", "");
    }

    // Handle background image change if applicable
    if (file) {
        handleFileUpload(file);
    }

    // Store the current state in history for undo/redo functionality
    if (keybindsIndex === keybindsHistory.length - 1) {
        keybindsHistory.push(JSON.stringify(newKeybinds));
        keybindsIndex++;
    } else {
        keybindsHistory = keybindsHistory.slice(0, keybindsIndex + 1);
        keybindsHistory.push(JSON.stringify(newKeybinds));
        keybindsIndex = keybindsHistory.length - 1;
    }

    saveMessage.textContent = "Settings saved!";
    saveMessage.style.display = "block";

    console.log("Saved settings", keybinds);
}

function handleFileUpload(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const imageData = e.target.result; // This will be in data URL format
        // Store imageData in localStorage or use it as needed
        localStorage.setItem("customBackground", imageData);
        BGbright.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

function applyDefaultNoteStyle() {
    const noteStyle = localStorage.getItem("noteStyle") || defaultKeybinds.noteStyle;
    if (noteStyle === "circles") {
        switchToCircles();
    } else {
        switchToArrows();
    }
}

function toggleNoteStyle() {
    const noteStyleButton = document.getElementById("toggleNoteStyleButton");
    const currentNoteStyle = localStorage.getItem("noteStyle") || "arrows";

    console.log("Current note style:", currentNoteStyle);

    if (currentNoteStyle === "arrows") {
        // Switch to circles
        console.log("Switching to circles...");
        switchToCircles();
        localStorage.setItem("noteStyle", "circles");
        noteStyleButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        console.log("Note style switched to circles.");
    } else {
        // Switch to arrows
        console.log("Switching to arrows...");
        switchToArrows();
        localStorage.setItem("noteStyle", "arrows");
        noteStyleButton.innerHTML = '<i class="fa-solid fa-circle"></i>';
        console.log("Note style switched to arrows.");
    }
}

// Function to switch all note images to circles
function switchToCircles() {
    noteLeftIMG.src = "Resources/CircleLeftHQ.png";
    noteDownIMG.src = "Resources/CircleDownHQ.png";
    noteUpIMG.src = "Resources/CircleUpHQ.png";
    noteRightIMG.src = "Resources/CircleRightHQ.png";
    noteLeftPressIMG.src = "Resources/CircleLeftPressHQ.png";
    noteDownPressIMG.src = "Resources/CircleDownPressHQ.png";
    noteUpPressIMG.src = "Resources/CircleUpPressHQ.png";
    noteRightPressIMG.src = "Resources/CircleRightPressHQ.png";
    console.log("Changed textures to circles");
}

// Function to switch all note images to arrows
function switchToArrows() {
    noteLeftIMG.src = "Resources/NoteLeftHQ.png";
    noteDownIMG.src = "Resources/NoteDownHQ.png";
    noteUpIMG.src = "Resources/NoteUpHQ.png";
    noteRightIMG.src = "Resources/NoteRightHQ.png";
    noteLeftPressIMG.src = "Resources/NoteLeftPressHQ.png";
    noteDownPressIMG.src = "Resources/NoteDownPressHQ.png";
    noteUpPressIMG.src = "Resources/NoteUpPressHQ.png";
    noteRightPressIMG.src = "Resources/NoteRightPressHQ.png";
    console.log("Changed textures to arrows");
}

function resetKeybinds() {
    keybinds = { ...defaultKeybinds, noteStyle: "arrows" };
    document.getElementById("songTimeoutAfterSongEnd").checked = false;
    document.getElementById("circularImage").checked = false;
    document.getElementById("vinylRotation").checked = false;

    const timeoutLabel = document.getElementById("numTimeout");
    const timeoutInput = document.getElementById("songTimeoutAfterSongEndNum");
    timeoutLabel.style.display = "none";
    timeoutInput.style.display = "none";

    switchToArrows();
    updateKeybindsFields();
    saveKeybinds();
}

function undoKeybinds() {
    if (keybindsIndex > 0) {
        keybindsIndex--;
        keybinds = JSON.parse(keybindsHistory[keybindsIndex]);
        updateKeybindsFields();
    }
}

function redoKeybinds() {
    if (keybindsIndex < keybindsHistory.length - 1) {
        keybindsIndex++;
        keybinds = JSON.parse(keybindsHistory[keybindsIndex]);
        updateKeybindsFields();
    }
}

function updateKeybindsFields() {
    document.getElementById("up").value = keybinds.up.join(", ");
    document.getElementById("left").value = keybinds.left.join(", ");
    document.getElementById("down").value = keybinds.down.join(", ");
    document.getElementById("right").value = keybinds.right.join(", ");
    document.getElementById("pause").value = keybinds.pause.join(", ");
    document.getElementById("autoHit").value = keybinds.autoHit.join(", ");
    document.getElementById("previousInput").value = keybinds.previous.join(", ");
    document.getElementById("restartInput").value = keybinds.restart.join(", ");
    document.getElementById("nextInput").value = keybinds.next.join(", ");
    document.getElementById("randomize").value = keybinds.randomize.join(", ");
    document.getElementById("toggleNoteStyleInput").value = keybinds.toggleNoteStyle.join(", ");
    document.getElementById("fullscreenInput").value = keybinds.fullscreen.join(", ");
    document.getElementById("debugInput").value = keybinds.debug.join(", ");
    document.getElementById("defaultNoteStyle").value = keybinds.noteStyle;
    document.getElementById("songTimeoutAfterSongEnd").checked = keybinds.songTimeoutAfterSongEnd;
    document.getElementById("songTimeoutAfterSongEndNum").value = keybinds.songTimeoutDelay;
    document.getElementById("vinylRotation").checked = keybinds.vinylRotation;
    document.getElementById("circularImage").checked = keybinds.circularImage;
    document.getElementById("defaultBackground").value = keybinds.backgroundOption;
    document.getElementById("backdropBlurInput").value = keybinds.customBackgroundBlur;

    if (keybinds.backgroundOption === "customBG" && keybinds.customBackground) {
        document.getElementById("customBGLabel").style.display = "inline";
        document.getElementById("customBGInput").style.display = "inline";
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
    } else if (keybinds.backgroundOption === "transparentBG") {
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
    } else {
        document.getElementById("customBGLabel").style.display = "none";
        document.getElementById("customBGInput").style.display = "none";
        document.getElementById("customTransparentBGblur").style.display = "none";
        document.getElementById("backdropBlurInput").style.display = "none";
    }
}

function toggleTimeoutInput() {
    const timeoutCheckbox = document.getElementById("songTimeoutAfterSongEnd");
    const timeoutLabel = document.getElementById("numTimeout");
    const timeoutInput = document.getElementById("songTimeoutAfterSongEndNum");

    if (timeoutCheckbox.checked) {
        timeoutLabel.style.display = "inline";
        timeoutInput.style.display = "inline";
    } else {
        timeoutLabel.style.display = "none";
        timeoutInput.style.display = "none";
    }
}

let restartSongTimeout;
let songTimeoutDelay = localStorage.getItem("songTimeoutDelay");

document.getElementById("songTimeoutAfterSongEnd").addEventListener("change", toggleTimeoutInput);

function keyDownFunction(keyboardEvent) {
    var keyDown = keyboardEvent.key.toLowerCase();
    console.log("Pressed:", keyDown);

    if (!gameStarted) {
        if (keyDown == "enter") {
            document.getElementById("startButton").click();
            gameStarted = true;
        }
        return;
    }

    if (gameStarted && keyDown == "enter") {
        return;
    }

    if (keybinds.up.includes(keyDown)) {
        upPressed = true;
    }
    if (keybinds.left.includes(keyDown)) {
        leftPressed = true;
    }
    if (keybinds.down.includes(keyDown)) {
        downPressed = true;
    }
    if (keybinds.right.includes(keyDown)) {
        rightPressed = true;
    }
    if (keybinds.pause.includes(keyDown)) {
        togglePause();
    }
    if (keybinds.autoHit.includes(keyDown)) {
        toggleAutoHit();
    }
    if (keybinds.fullscreen.includes(keyDown)) {
        toggleFullScreen();
    }
    if (keybinds.previous.includes(keyDown)) {
        previousSong();
    }
    if (keybinds.restart.includes(keyDown)) {
        restartSong();
    }
    if (keybinds.next.includes(keyDown)) {
        nextSong();
    }
    if (keybinds.randomize.includes(keyDown)) {
        randomizeSong();
    }
    if (keybinds.toggleNoteStyle.includes(keyDown)) {
        toggleNoteStyle();
    }
    if (keybinds.debug.includes(keyDown)) {
        toggleDebugInfo();
    }
}

function keyUpFunction(keyboardEvent) {
    var keyUp = keyboardEvent.key.toLowerCase();
    console.log("Released:", keyUp);

    if (keybinds.up.includes(keyUp)) {
        upPressed = false;
    }
    if (keybinds.left.includes(keyUp)) {
        leftPressed = false;
    }
    if (keybinds.down.includes(keyUp)) {
        downPressed = false;
    }
    if (keybinds.right.includes(keyUp)) {
        rightPressed = false;
    }
}
