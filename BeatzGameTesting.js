/**
 * Title: Beatz
 * Author: Victor//GuayabR
 * Date: 16/05/2024
 * Version: SONGv 3.7.0.1 test (release.version.subversion.bugfix)
 * GitHub Repository: https://github.com/GuayabR/Beatz
 **/

// CONSTANTS

const VERSION = "SONGv 3.7.0 (Codename.Release.Version.Subversion.Bugfix)";
const PUBLICVERSION = "3.7! (GitHub Port)";
console.log("Version: " + VERSION);

const canvas = document.getElementById("myCanvas");

const ctx = canvas.getContext("2d");

const userDevice = detectDeviceType();

const WIDTH = 1280;

const HEIGHT = 720;

const noteWidth = 50;

const noteHeight = 50;

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

let notesHit = 0;
let tutorialStage = 0;
let isNewPlayer = !localStorage.getItem("newPlayer");

// Retrieve the keybinds object from localStorage and parse it
var storedKeybinds = JSON.parse(localStorage.getItem("keybinds")) || {};

const keybindsText = {
    initial: {
        left: storedKeybinds.left ? storedKeybinds.left[0] : "A",
        up: storedKeybinds.up ? storedKeybinds.up[0] : "W",
        down: storedKeybinds.down ? storedKeybinds.down[0] : "S",
        right: storedKeybinds.right ? storedKeybinds.right[0] : "D",
    },
    customizable: "Keybinds are customizable in the gear icon just below the canvas.",
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

var noteSpeed;

let currentConfigIndex = 0;

var HIT_Y_RANGE_MIN = 500;

var HIT_Y_RANGE_MAX = 600;

var PERFECT_HIT_RANGE_MIN = 542;

var PERFECT_HIT_RANGE_MAX = 568;

var showHitboxes = false;

var BPM;

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

var notes = [];

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
var hitSounds = [];

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
    hitSounds.forEach(hitSound => {
        hitSound.volume = volume;
    });
}

var currentHitSoundIndex = 0; // Keep track of the last played hit sound

// Initialize hit sounds with the loaded volume
function initializeHitSounds(hitSoundType) {
    const hitSoundPathMap = {
        defaultHit: "Resources/SFX/hitSound.mp3",
        mcHit: "Resources/SFX/mcHitSound.mp3",
        hitMarker: "Resources/SFX/Hitmarker.m4a",
        clickHit: "Resources/SFX/Mouse Click.mp3",
    };

    const hitSoundPath = hitSoundPathMap[hitSoundType];

    for (let i = 0; i < MAX_HIT_SOUNDS; i++) {
        let hitSound = new Audio(hitSoundPath);
        hitSound.volume = currentHitSoundVolume; // Set volume to the saved or default volume
        hitSounds.push(hitSound);
    }
}

console.log("Variables loaded.");

// TEXTURES

// IMAGES
var noteLeftIMG = new Image();

var noteDownIMG = new Image();

var noteUpIMG = new Image();

var noteRightIMG = new Image();

var noteLeftPressIMG = new Image();

var noteDownPressIMG = new Image();

var noteUpPressIMG = new Image();

var noteRightPressIMG = new Image();

var noCover = new Image("Resources/Covers/noCover.png"); // Used for covers that are not found in the files (e.g forgot to add it or misspelt it)

var BGbright = new Image("Resources/Background2.png"); // Default background

var BG2 = new Image("Resources/Background3.jpg"); // Wavy chromatic background

var BG3 = new Image("Resources/Background4.png"); // Dark orange sunset

var BG4 = new Image("Resources/BackgroundHtml2.png"); // HTML Background (Windows orange-purple bloom)

var BG5 = new Image("Resources/Background5.jpg"); // Dark Blue Flow Background

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
        "Resources/Songs/BUTTERFLY EFFECT.mp3",
        "Resources/Songs/SWIM.mp3",
        "Resources/Songs/FE!N.mp3",
        "Resources/Songs/Crazy.mp3",
        "Resources/Songs/Despacito.mp3",
        "Resources/Songs/You Need Jesus.mp3",
        "Resources/Songs/Nautilus.mp3",
        "Resources/Songs/Levitating.mp3",
        "Resources/Songs/MY EYES.mp3",
        "Resources/Songs/Faint.mp3",
        "Resources/Songs/Breaking The Habit.mp3",
        "Resources/Songs/From The Inside.mp3",
        "Resources/Songs/I Wonder.mp3",
        "Resources/Songs/Godzilla.mp3",
        "Resources/Songs/HIGHEST IN THE ROOM.mp3",
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
        "Resources/Songs/Slide da Treme Melódica v2.mp3",
        "Resources/Songs/fantasmas.mp3",
        "Resources/Songs/BIKE.mp3",
        "Resources/Songs/ARCÀNGEL.mp3",
        "Resources/Songs/TELEKINESIS.mp3",
        "Resources/Songs/Bleed it out.mp3",
        "Resources/Songs/Grenade.mp3",
        "Resources/Songs/24K Magic.mp3",
        "Resources/Songs/Finesse.mp3",
        "Resources/Songs/Not Like Us.mp3",
        "Resources/Songs/Type Shit.mp3",
        "Resources/Songs/Like That.mp3",
        "Resources/Songs/That's What I Like.mp3",
        "Resources/Songs/Renaissance.mp3",
        "Resources/Songs/Habits.mp3",
        "Resources/Songs/Trouble.mp3",
        "Resources/Songs/Brand New Dance.mp3",
        "Resources/Songs/Evil.mp3",
        "Resources/Songs/Lucifer.mp3",
        "Resources/Songs/Antichrist.mp3",
        "Resources/Songs/Fuel.mp3",
        "Resources/Songs/Road Rage.mp3",
        "Resources/Songs/Houdini.mp3",
        "Resources/Songs/Guilty Conscience 2.mp3",
        "Resources/Songs/Head Honcho.mp3",
        "Resources/Songs/Temporary.mp3",
        "Resources/Songs/Bad One.mp3",
        "Resources/Songs/Tobey.mp3",
        "Resources/Songs/Somebody Save Me.mp3",
        "Resources/Songs/this is what space feels like.mp3",
        "Resources/Songs/SICKO MODE.mp3",
        "Resources/Songs/THE SCOTTS.mp3",
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
                addSongToList(songPath, songTitle); // Add the song to the list
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
        if (songLoadCounter === 1) {
            const startButton = document.getElementById("startButton");
            startButton.style.display = "inline";
        } else if (songLoadCounter === totalSongs) {
            setTimeout(() => {
                if (headerElement.contains(counterText)) {
                    headerElement.removeChild(counterText);
                }
            }, 2500);
        }
    }

    let listOfSongs = []; // Store song paths and titles for filtering

    function addSongToList(songPath, songTitle) {
        const songListContainer = document.getElementById("songList");

        const songButton = document.createElement("button");
        songButton.className = "song-button";
        const currentIndex = songListContainer.childElementCount + 1; // Get current count of child elements

        // Get album information if available
        let album = songToAlbumMap[songTitle] || "Unknown Album";

        // If the album matches the song title, display "Single" instead of the album name
        if (album.toLowerCase() === songTitle.toLowerCase()) {
            album = "Single";
        }

        // Check if the song title ends with a dot
        if (songTitle.endsWith(".")) {
            songButton.textContent = `${album} | Song ${currentIndex}: ${songTitle} by ${getArtist(songTitle)}.`;
        } else {
            songButton.textContent = `${album} | Song ${currentIndex}: ${songTitle}, by ${getArtist(songTitle)}.`;
        }

        songButton.dataset.path = songPath; // Store song path as a data attribute
        songListContainer.appendChild(songButton);

        songButton.onclick = function () {
            openSelectedSongModal(songPath, songTitle);
        };

        // Store song path and title for filtering
        listOfSongs.push({ path: songPath, title: songTitle });

        console.log(`Song added to list: ${songTitle} - ${songPath}`);
    }

    // Start loading the first song
    loadNextSong();
}

const songVersions = {
    Finesse: [
        { path: "Resources/Songs/Finesse.mp3", title: "Finesse" },
        { path: "Resources/Songs/Finesse (feat. Cardi B).mp3", title: "Finesse (feat. Cardi B)" }, // Other version, don't recognize this one
    ],
    "WTF 2": [
        { path: "Resources/Songs/WTF 2.mp3", title: "WTF 2" },
        { path: "Resources/Songs/WTF 2 - Slowed.mp3", title: "WTF 2 - Slowed" }, // Other version, don't recognize this one
        { path: "Resources/Songs/WTF 2 - Sped Up.mp3", title: "WTF 2 - Sped Up" }, // Other version, don't recognize this one
    ],
    "Slide da Treme Melódica v2": [
        { path: "Resources/Songs/Slide da Treme Melódica v2.mp3", title: "Slide da Treme Melódica v2" },
        { path: "Resources/Songs/Slide da Treme Melódica v2 - Slowed.mp3", title: "Slide da Treme Melódica v2 - Slowed" }, // Other version, don't recognize this one
        { path: "Resources/Songs/Slide da Treme Melódica v2 - Ultra Slowed.mp3", title: "Slide da Treme Melódica v2 - Ultra Slowed" }, // Other version, don't recognize this one
        { path: "Resources/Songs/Slide da Treme Melódica v2 - Sped Up.mp3", title: "Slide da Treme Melódica v2 - Sped Up" }, // Other version, don't recognize this one
    ],
    Goosebumps: [
        { path: "Resources/Songs/Goosebumps.mp3", title: "Goosebumps" },
        { path: "Resources/Songs/Goosebumps (feat. 21 Savage).mp3", title: "Goosebumps (feat. 21 Savage)" }, // Other version, don't recognize this one
    ],
    // Add other songs and their versions here
};

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
    "Resources/Songs/WTF 2.mp3": { BPM: 116, noteSpeed: 14 },
    "Resources/Songs/MY EYES.mp3": { BPM: 132, noteSpeed: 12 },
    "Resources/Songs/Can't Slow Me Down.mp3": { BPM: 122, noteSpeed: 11 },
    "Resources/Songs/LUNCH.mp3": { BPM: 125, noteSpeed: 14.6 },
    "Resources/Songs/BUTTERFLY EFFECT.mp3": { BPM: 141, noteSpeed: 10 },
    "Resources/Songs/SWIM.mp3": { BPM: 120, noteSpeed: 10 },
    "Resources/Songs/You Need Jesus.mp3": { BPM: 110, noteSpeed: 11 },
    "Resources/Songs/Crazy.mp3": { BPM: 120, noteSpeed: 10 },
    "Resources/Songs/Despacito.mp3": { BPM: 89, noteSpeed: 10 },
    "Resources/Songs/FE!N.mp3": { BPM: 148, noteSpeed: 12 },
    "Resources/Songs/Nautilus.mp3": { BPM: 124, noteSpeed: 9 },
    "Resources/Songs/Levitating.mp3": { BPM: 103, noteSpeed: 10 },
    "Resources/Songs/Somewhere I Belong.mp3": { BPM: 162, noteSpeed: 10 },
    "Resources/Songs/From The Inside.mp3": { BPM: 95, noteSpeed: 10.5 },
    "Resources/Songs/Faint.mp3": { BPM: 135, noteSpeed: 11 },
    "Resources/Songs/Breaking The Habit.mp3": { BPM: 100, noteSpeed: 10 },
    "Resources/Songs/I Wonder.mp3": { BPM: 127, noteSpeed: 8 },
    "Resources/Songs/Godzilla.mp3": { BPM: 166, noteSpeed: 13 },
    "Resources/Songs/HIGHEST IN THE ROOM.mp3": { BPM: 156, noteSpeed: 0 },
    "Resources/Songs/Runaway.mp3": { BPM: 85, noteSpeed: 10 },
    "Resources/Songs/Rush E.mp3": { BPM: 500, noteSpeed: 20 },
    "Resources/Songs/Vamp Anthem.mp3": { BPM: 164, noteSpeed: 12 },
    "Resources/Songs/CARNIVAL.mp3": { BPM: 148, noteSpeed: 12 },
    "Resources/Songs/HUMBLE..mp3": { BPM: 150, noteSpeed: 0 },
    "Resources/Songs/Stop Breathing.mp3": { BPM: 155, noteSpeed: 12 },
    "Resources/Songs/CHEGOU 3.mp3": { BPM: 130, noteSpeed: 13.2 },
    "Resources/Songs/KRUSH ALERT.mp3": { BPM: 117, noteSpeed: 12.5 },
    "Resources/Songs/CUTE DEPRESSED.mp3": { BPM: 228, noteSpeed: 16 },
    "Resources/Songs/MOVE YO BODY.mp3": { BPM: 133, noteSpeed: 12 },
    "Resources/Songs/SLAY!.mp3": { BPM: 130, noteSpeed: 13 },
    "Resources/Songs/ROCK THAT SHIT!.mp3": { BPM: 125, noteSpeed: 12 },
    "Resources/Songs/BAIXO.mp3": { BPM: 133, noteSpeed: 12 },
    "Resources/Songs/LOOK DON'T TOUCH.mp3": { BPM: 125, noteSpeed: 13 },
    "Resources/Songs/MOVE YO BODY.mp3": { BPM: 133, noteSpeed: 12 },
    "Resources/Songs/YOU'RE TOO SLOW.mp3": { BPM: 162, noteSpeed: 14.5 },
    "Resources/Songs/BAND4BAND.mp3": { BPM: 140, noteSpeed: 14 },
    "Resources/Songs/Slide da Treme Melódica v2.mp3": { BPM: 210, noteSpeed: 18 },
    "Resources/Songs/fantasmas.mp3": { BPM: 164, noteSpeed: 10 },
    "Resources/Songs/BIKE.mp3": { BPM: 105, noteSpeed: 14 },
    "Resources/Songs/ARCÀNGEL.mp3": { BPM: 124, noteSpeed: 14 },
    "Resources/Songs/TELEKINESIS.mp3": { BPM: 166, noteSpeed: 12 },
    "Resources/Songs/Bleed it out.mp3": { BPM: 140, noteSpeed: 0 },
    "Resources/Songs/Grenade.mp3": { BPM: 110, noteSpeed: 0 },
    "Resources/Songs/24K Magic.mp3": { BPM: 107, noteSpeed: 15 },
    "Resources/Songs/Finesse.mp3": { BPM: 105, noteSpeed: 22 },
    "Resources/Songs/Not Like Us.mp3": { BPM: 101, noteSpeed: 0 },
    "Resources/Songs/Type Shit.mp3": { BPM: 145, noteSpeed: 14 },
    "Resources/Songs/Like That.mp3": { BPM: 162, noteSpeed: 16 },
    "Resources/Songs/That's What I Like.mp3": { BPM: 134, noteSpeed: 14 },
    "Resources/Songs/Renaissance.mp3": { BPM: 199, noteSpeed: 0 },
    "Resources/Songs/Habits.mp3": { BPM: 100, noteSpeed: 10 },
    "Resources/Songs/Trouble.mp3": { BPM: 83, noteSpeed: 8 },
    "Resources/Songs/Brand New Dance.mp3": { BPM: 120, noteSpeed: 14 },
    "Resources/Songs/Evil.mp3": { BPM: 81, noteSpeed: 10 },
    "Resources/Songs/Lucifer.mp3": { BPM: 79, noteSpeed: 8 },
    "Resources/Songs/Antichrist.mp3": { BPM: 99, noteSpeed: 10 },
    "Resources/Songs/Fuel.mp3": { BPM: 138, noteSpeed: 12 },
    "Resources/Songs/Road Rage.mp3": { BPM: 95, noteSpeed: 10 },
    "Resources/Songs/Houdini.mp3": { BPM: 141, noteSpeed: 12 },
    "Resources/Songs/Guilty Conscience 2.mp3": { BPM: 164, noteSpeed: 14 },
    "Resources/Songs/Head Honcho.mp3": { BPM: 173, noteSpeed: 16 },
    "Resources/Songs/Temporary.mp3": { BPM: 78, noteSpeed: 8 },
    "Resources/Songs/Bad One.mp3": { BPM: 146, noteSpeed: 14 },
    "Resources/Songs/Tobey.mp3": { BPM: 139, noteSpeed: 14 },
    "Resources/Songs/Somebody Save Me.mp3": { BPM: 181, noteSpeed: 16 },
    "Resources/Songs/this is what space feels like.mp3": { BPM: 146, noteSpeed: 11 },
    "Resources/Songs/SICKO MODE.mp3": { BPM: 155, noteSpeed: 0 },
    "Resources/Songs/THE SCOTTS.mp3": { BPM: 130, noteSpeed: 0 },
    "Resources/Songs/Finesse (feat. Cardi B).mp3": { BPM: 105, noteSpeed: 22 },
    "Resources/Songs/WTF 2 - Slowed.mp3": { BPM: 148, noteSpeed: 12 },
    "Resources/Songs/WTF 2 - Sped Up.mp3": { BPM: 130, noteSpeed: 16 },
    "Resources/Songs/Slide da Treme Melódica v2 - Slowed.mp3": { BPM: 125, noteSpeed: 16 },
    "Resources/Songs/Slide da Treme Melódica v2 - Ultra Slowed.mp3": { BPM: 159, noteSpeed: 16 },
    "Resources/Songs/Slide da Treme Melódica v2 - Sped Up.mp3": { BPM: 157, noteSpeed: 18 },
    "Resources/Songs/Goosebumps (feat. 21 Savage).mp3": { BPM: 130, noteSpeed: 8 },
};

let savedNotes;

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
            { timestamp: 165.9, noteSpeed: 18.2, notes: [] }, // Notes end, last note is the ending note for the song
            { timestamp: 169, noteSpeed: 18.2, endScreenDrawn: true }, // Endscreen is drawn before song ends in case song has a long ending without much beat
        ],
        "Bleed it out": [
            { timestamp: 2.7, noteSpeed: 20 },
            { timestamp: 9.9, noteSpeed: 13 },
            { timestamp: 20.2, noteSpeed: 14 },
            { timestamp: 23.65, noteSpeed: 15 },
            { timestamp: 33.95, noteSpeed: 13 },
            { timestamp: 37.4, noteSpeed: 16 },
            { timestamp: 51.05, noteSpeed: 13.5 },
            { timestamp: 78.5, noteSpeed: 15 },
            { timestamp: 92.25, noteSpeed: 17 },
            { timestamp: 109.35, noteSpeed: 12 },
            { timestamp: 116.2, noteSpeed: 13.5 },
            { timestamp: 123.035, noteSpeed: 14.5 },
            { timestamp: 128.1, noteSpeed: 12 },
            { timestamp: 129.6, noteSpeed: 13.5 },
            { timestamp: 130, noteSpeed: 16 },
            { timestamp: 140.25, noteSpeed: 17 },
            { timestamp: 143.7, noteSpeed: 18 },
            { timestamp: 157.4, noteSpeed: 18, notes: [] },
            { timestamp: 163.25, noteSpeed: 18, endScreenDrawn: true },
        ],
        Grenade: [
            { timestamp: 3.95, noteSpeed: 12 },
            { timestamp: 198.8, noteSpeed: 12, notes: [] },
            { timestamp: 216.6, noteSpeed: 12, endScreenDrawn: true },
        ],
        Finesse: [
            { timestamp: 4.85, noteSpeed: 14 },
            { timestamp: 214.5, noteSpeed: 14, endScreenDrawn: true },
        ],
        "Finesse (feat. Cardi B)": [
            { timestamp: 4.85, noteSpeed: 14 },
            { timestamp: 214.5, noteSpeed: 14, endScreenDrawn: true },
        ],
        "Not Like Us": [{ timestamp: 1.73, noteSpeed: 14 }],
        "Like That": [{ timestamp: 6.7, noteSpeed: 14 }],
        "this is what space feels like": [
            { timestamp: 35.95, noteSpeed: 0 },
            { timestamp: 37.6, noteSpeed: 25 },
            { timestamp: 38.35, noteSpeed: 0 },
            { timestamp: 38.8, noteSpeed: 25 },
            { timestamp: 39.55, noteSpeed: 0 },
            { timestamp: 39.58, noteSpeed: 25 },
            { timestamp: 40.4, noteSpeed: 0 },
            { timestamp: 40.93, noteSpeed: 25 },
            { timestamp: 41.7, noteSpeed: 0 },
            { timestamp: 44.15, noteSpeed: 18 },
            { timestamp: 63.94, noteSpeed: 14 },
        ],
        Renaissance: [{ timestamp: 11, noteSpeed: 14 }],
        "HUMBLE.": [
            { timestamp: 6.78, noteSpeed: 12 },
            { timestamp: 7.7, noteSpeed: 14 },
        ],
        "SICKO MODE": [
            { timestamp: 27.6, noteSpeed: 12 }, // sun is down
            { timestamp: 56, noteSpeed: 14 }, // omega bass
            { timestamp: 58.85, noteSpeed: 14, savedNotes: notes },
            { timestamp: 58.9, noteSpeed: 14, notes: [] },
            { timestamp: 64.3, noteSpeed: 14, notes: savedNotes },
            { timestamp: 65, noteSpeed: 14 },
        ],
        "THE SCOTTS": [{ timestamp: 22.2, noteSpeed: 14 }],
    };

    let songTitle = getSongTitle(songSrc);
    if (dynamicSpeeds.hasOwnProperty(songTitle)) {
        return dynamicSpeeds[songTitle];
    } else {
        return null;
    }
}

console.log("Song Configurations loaded.");

const songToAlbumMap = {
    Epilogue: "Epilogue",
    Exosphere: "Exosphere",
    "Die For You": "Die For You",
    "Father Stretch My Hands": "The Life Of Pablo",
    "Betty (Get Money)": "Betty (Get Money)",
    "BURN IT DOWN": "LIVING THINGS",
    "Aleph 0": "Aleph 0",
    "Better Days": "Better Days",
    KOCMOC: "KOCMOC",
    "kompa pasion": "kompa pasion",
    "Legends Never Die": "Legends Never Die",
    "Star Walkin": "Star Walkin",
    "What I've Done": "Minutes To Midnight",
    "Biggest NCS Songs": "Biggest NCS Songs",
    Goosebumps: "Birds in the Trap Sing McKnight",
    Numb: "Meteora",
    "sdp interlude": "Birds in the Trap Sing McKnight",
    "Shiawase (VIP)": "Shiawase (VIP)",
    "Master Of Puppets (Live)": "Master Of Puppets",
    VVV: "VVV",
    "Sleepwalker X Icewhxre": "Sleepwalker X Icewhxre",
    "WTF 2": "WTF 2",
    VISIONS: "VISIONS",
    "Stressed Out": "Blurryface",
    "Ticking Away": "Ticking Away",
    "MY EYES": "UTOPIA",
    "Can't Slow Me Down": "Can't Slow Me Down",
    LUNCH: "Hit Me Hard and Soft",
    "BUTTERFLY EFFECT": "BUTTERFLY EFFECT",
    SWIM: "Chase Atlantic",
    "You Need Jesus": "You Need Jesus",
    Crazy: "Octane",
    Despacito: "Despacito",
    "FE!N": "UTOPIA",
    Nautilus: "Nautilus",
    Levitating: "Future Nostalgia",
    "Somewhere I Belong": "Meteora",
    "From The Inside": "Meteora",
    Faint: "Meteora",
    "Breaking The Habit": "Meteora",
    "I Wonder": "Graduation",
    Godzilla: "Music to Be Murdered By",
    "HIGHEST IN THE ROOM": "HIGHEST IN THE ROOM",
    Runaway: "My Beautiful Dark Twisted Fantasy",
    "Rush E": "Rush E",
    "Vamp Anthem": "Whole Lotta Red",
    CARNIVAL: "VULTURES 1",
    "HUMBLE.": "DAMN.",
    "Stop Breathing": "Whole Lotta Red",
    "CHEGOU 3": "CHEGOU 3",
    "KRUSH ALERT": "KRUSH ALERT",
    BAIXO: "BAIXO",
    "MOVE YO BODY": "MOVE YO BODY",
    "SLAY!": "SLAY!",
    "ROCK THAT SHIT!": "ROCK THAT SHIT!",
    "CUTE DEPRESSED": "CUTE DEPRESSED",
    "LOOK DON'T TOUCH": "LOOK DON'T TOUCH",
    "YOU'RE TOO SLOW": "YOU'RE TOO SLOW",
    BAND4BAND: "BAND4BAND",
    "Slide da Treme Melódica v2": "Slide da Treme Melódica v2",
    fantasmas: "fantasmas",
    BIKE: "BIKE",
    ARCÀNGEL: "ARCÀNGEL",
    TELEKINESIS: "UTOPIA",
    "Bleed it out": "Minutes To Midnight E",
    Grenade: "Doo-Wops & Hooligans",
    "24K Magic": "24K Magic",
    Finesse: "24K Magic",
    "Not Like Us": "Not Like Us",
    "Type Shit": "We Don't Trust You",
    "Like That": "We Don't Trust You",
    "That's What I Like": "24K Magic",
    Renaissance: "The Death of Slim Shady (Coup de Grâce)",
    Habits: "The Death of Slim Shady (Coup de Grâce)",
    Trouble: "The Death of Slim Shady (Coup de Grâce)",
    "Brand New Dance": "The Death of Slim Shady (Coup de Grâce)",
    Evil: "The Death of Slim Shady (Coup de Grâce)",
    Lucifer: "The Death of Slim Shady (Coup de Grâce)",
    Antichrist: "The Death of Slim Shady (Coup de Grâce)",
    Fuel: "The Death of Slim Shady (Coup de Grâce)",
    "Road Rage": "The Death of Slim Shady (Coup de Grâce)",
    Houdini: "The Death of Slim Shady (Coup de Grâce)",
    "Guilty Conscience 2": "The Death of Slim Shady (Coup de Grâce)",
    "Head Honcho": "The Death of Slim Shady (Coup de Grâce)",
    Temporary: "The Death of Slim Shady (Coup de Grâce)",
    "Bad One": "The Death of Slim Shady (Coup de Grâce)",
    Tobey: "The Death of Slim Shady (Coup de Grâce)",
    "Somebody Save Me": "The Death of Slim Shady (Coup de Grâce)",
    "this is what space feels like": "this is what space feels like",
    "SICKO MODE": "ASTROWORLD",
    "THE SCOTTS": "THE SCOTTS",
    "Finesse (feat. Cardi B)": "24K Magic",
    "WTF 2 - Slowed": "WTF 2 - Slowed",
    "WTF 2 - Sped Up": "WTF 2 - Sped Up",
    "Slide da Treme Melódica v2 - Slowed": "Slide da Treme Melódica v2 - Slowed",
    "Slide da Treme Melódica v2 - Ultra Slowed": "Slide da Treme Melódica v2 - Ultra Slowed",
    "Slide da Treme Melódica v2 - Sped Up": "Slide da Treme Melódica v2 - Sped Up",
    "Goosebumps (feat. 21 Savage)": "Birds in the Trap Sing McKnight",
};

// Function to preload images
function preloadImages() {
    const albumCovers = [
        "Resources/Covers/Epilogue.jpg",
        "Resources/Covers/Exosphere.jpg",
        "Resources/Covers/Die For You.jpg",
        "Resources/Covers/The Life Of Pablo.jpg",
        "Resources/Covers/Betty (Get Money).jpg",
        "Resources/Covers/LIVING THINGS.jpg",
        "Resources/Covers/Aleph 0.jpg",
        "Resources/Covers/Better Days.jpg",
        "Resources/Covers/KOCMOC.jpg",
        "Resources/Covers/kompa pasion.jpg",
        "Resources/Covers/Legends Never Die.jpg",
        "Resources/Covers/Star Walkin.jpg",
        "Resources/Covers/Minutes To Midnight.jpg",
        "Resources/Covers/Minutes To Midnight E.jpg",
        "Resources/Covers/Biggest NCS Songs.jpg",
        "Resources/Covers/Birds in the Trap Sing McKnight.jpg",
        "Resources/Covers/Master Of Puppets.jpg",
        "Resources/Covers/Meteora.jpg",
        "Resources/Covers/Shiawase (VIP).jpg",
        "Resources/Covers/Sleepwalker X Icewhxre.jpg",
        "Resources/Covers/Blurryface.jpg",
        "Resources/Covers/Ticking Away.jpg",
        "Resources/Covers/VISIONS.jpg",
        "Resources/Covers/VVV.jpg",
        "Resources/Covers/WTF 2.jpg",
        "Resources/Covers/UTOPIA.jpg",
        "Resources/Covers/Can't Slow Me Down.jpg",
        "Resources/Covers/Hit Me Hard and Soft.jpg",
        "Resources/Covers/BUTTERFLY EFFECT.jpg",
        "Resources/Covers/Chase Atlantic.jpg",
        "Resources/Covers/You Need Jesus.jpg",
        "Resources/Covers/Octane.jpg",
        "Resources/Covers/Despacito.jpg",
        "Resources/Covers/Nautilus.jpg",
        "Resources/Covers/Future Nostalgia.jpg",
        "Resources/Covers/Graduation.jpg",
        "Resources/Covers/Music to Be Murdered By.jpg",
        "Resources/Covers/My Beautiful Dark Twisted Fantasy.jpg",
        "Resources/Covers/Rush E.jpg",
        "Resources/Covers/Whole Lotta Red.jpg",
        "Resources/Covers/VULTURES 1.jpg",
        "Resources/Covers/DAMN..jpg",
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
        "Resources/Covers/ARCÀNGEL.jpg",
        "Resources/Covers/Doo-Wops & Hooligans.jpg",
        "Resources/Covers/24K Magic.jpg",
        "Resources/Covers/Not Like Us.jpg",
        "Resources/Covers/We Don't Trust You.jpg",
        "Resources/Covers/The Death of Slim Shady (Coup de Grâce).jpg",
        "Resources/Covers/this is what space feels like.jpg",
        "Resources/Covers/ASTROWORLD.jpg",
        "Resources/Covers/THE SCOTTS.jpg",
        "Resources/Covers/ASTRONOMICAL.jpg",
        "Resources/Covers/WTF 2 - Slowed.jpg",
        "Resources/Covers/WTF 2 - Sped Up.jpg",
        "Resources/Covers/Slide da Treme Melódica v2 - Slowed.jpg",
        "Resources/Covers/Slide da Treme Melódica v2 - Ultra Slowed.jpg",
        "Resources/Covers/Slide da Treme Melódica v2 - Sped Up.jpg",
    ];

    // Load album cover images
    for (const coverPath of albumCovers) {
        const albumTitle = getAlbumTitle(coverPath);
        const coverImage = new Image();
        coverImage.src = coverPath;
        coverImage.onload = function () {
            loadedImages[albumTitle] = coverImage;
            console.log("Loaded cover image for album:", albumTitle);
        };
        coverImage.onerror = function () {
            console.log("Failed to load cover image for album:", albumTitle);
        };
    }
}

// Helper function to get album title from the cover path
function getAlbumTitle(coverPath) {
    const parts = coverPath.split("/");
    const fileName = parts[parts.length - 1];
    return fileName.replace(".jpg", "");
}

// Ensure getCoverImage correctly retrieves the image
function getCoverImage(songTitle) {
    const albumTitle = songToAlbumMap[songTitle];
    return loadedImages[albumTitle];
}

const selectedSongModal = document.getElementById("selectedSongModal");
const songListModal = document.getElementById("songListModal");

function saveRecentSong(songPath, songTitle, songIndex, songArtist) {
    localStorage.setItem("recentSongPath", songPath);
    localStorage.setItem("recentSongTitle", songTitle);
    localStorage.setItem("recentSongIndex", songIndex);
    localStorage.setItem("recentSongArtist", songArtist);
}

// Load the most recent song from localStorage
function loadRecentSong() {
    const recentSongPath = localStorage.getItem("recentSongPath");
    const recentSongTitle = localStorage.getItem("recentSongTitle");
    const recentSongIndex = localStorage.getItem("recentSongIndex");
    const recentSongArtist = localStorage.getItem("recentSongArtist");
    if (recentSongPath && recentSongTitle && recentSongIndex && recentSongArtist) {
        return {
            path: recentSongPath,
            title: recentSongTitle,
            index: recentSongIndex,
            artist: recentSongArtist,
        };
    }
    return null;
}

// Update the "Play most recent song" button text
function updateRecentSongButton() {
    const recentSong = loadRecentSong();
    const mostRecentButton = document.getElementById("mostRecent");
    if (recentSong) {
        // Check if the song title ends with a dot
        if (recentSong.title.endsWith(".")) {
            mostRecentButton.textContent = `Play most recent song: #${recentSong.index}: ${recentSong.title} by ${recentSong.artist}`;
        } else {
            mostRecentButton.textContent = `Play most recent song: #${recentSong.index}: ${recentSong.title}, by ${recentSong.artist}`;
        }
        mostRecentButton.style.display = "inline-block";
    } else {
        mostRecentButton.style.display = "none";
    }
}

// Play the most recent song
function playRecentSong() {
    const recentSong = loadRecentSong();
    if (recentSong) {
        const index = songList.findIndex(s => s === recentSong.path);
        startGame(index);
        songListModal.style.display = "none";
        activateKeybinds();
    } else {
        alert("No recent song found. Select one from the index!");
    }
}

// Event listener for "Play most recent song" button
document.getElementById("mostRecent").addEventListener("click", playRecentSong);

// Update the recent song button on page load
window.addEventListener("load", updateRecentSongButton);

function openSelectedSongModal(songPath, songTitle) {
    const song = songList.find(s => s === songPath);
    if (song) {
        const songArtist = getArtist(songTitle);
        const songTitleElement = document.getElementById("songTitle");
        const songArtistElement = document.getElementById("songArtist");
        const songBPMElement = document.getElementById("songBPM");
        const songSpeedElement = document.getElementById("songSpeed");
        const versionDropdownContainer = document.getElementById("versionDropdownContainer");
        const versionDropdown = document.getElementById("versionDropdown");

        // Function to update modal content
        function updateModalContent(versionPath, versionTitle) {
            const versionConfig = songConfigs[versionPath] || {};
            songTitleElement.textContent = versionTitle;
            songArtistElement.textContent = getArtist(versionTitle);
            songBPMElement.textContent = versionConfig.BPM || "BPM not available";

            // Display cover image
            const coverImageElement = document.getElementById("songCoverImage");
            const coverImage = getCoverImage(versionTitle); // Get the cover image based on version title
            if (coverImage) {
                coverImageElement.src = coverImage.src;
            } else {
                coverImageElement.src = "Resources/Covers/noCover.png"; // Placeholder cover image path
            }

            // Check if dynamic speeds are defined for the song
            const dynamicSpeeds = getDynamicSpeed(versionPath);
            if (dynamicSpeeds) {
                let totalNoteSpeed = dynamicSpeeds.reduce((acc, speed) => acc + speed.noteSpeed, 0);
                let averageNoteSpeed = totalNoteSpeed / dynamicSpeeds.length;
                songSpeedElement.textContent = `${averageNoteSpeed.toFixed(2)}`;
                document.getElementById("speedTXT").innerHTML = `<strong>Average Note Speed:</strong>`;
            } else {
                let noteSpeed = versionConfig.noteSpeed || "Note Speed not available";
                songSpeedElement.textContent = `${noteSpeed}`;
                document.getElementById("speedTXT").innerHTML = `<strong>Note Speed:</strong>`;
            }
        }

        // Set initial modal content
        updateModalContent(songPath, songTitle);

        // Determine default version path
        const defaultVersionPath = songList.find(s => s === songPath);
        const isDefaultVersion = songPath === defaultVersionPath;

        // Check for song versions
        if (songVersions[songTitle]) {
            versionDropdownContainer.style.display = "block";
            versionDropdownContainer.style.paddingBottom = "20px"; // Adjust this value to create space similar to <br><br>
            versionDropdown.innerHTML = "";
            songVersions[songTitle].forEach((version, index) => {
                const option = document.createElement("option");
                option.value = version.path;
                option.textContent = version.title;
                versionDropdown.appendChild(option);

                // Check if this version is the default version
                if (version.path === defaultVersionPath) {
                    versionDropdown.selectedIndex = index; // Set the default option
                }
            });

            // Add change event listener to the dropdown
            versionDropdown.addEventListener("change", function () {
                const selectedVersionPath = versionDropdown.value;
                const selectedVersionTitle = versionDropdown.options[versionDropdown.selectedIndex].textContent;
                updateModalContent(selectedVersionPath, selectedVersionTitle);
            });
        } else {
            versionDropdownContainer.style.display = "none";
        }

        // Show the modal
        selectedSongModal.style.display = "block";
        songListModal.style.display = "none";

        // Add click event listener to the play button
        const playButton = document.getElementById("playSongButton");
        playButton.addEventListener("click", function () {
            const selectedVersionPath = versionDropdown.value || songPath;
            let setIndex;
            let index;

            if (selectedVersionPath === defaultVersionPath) {
                // If the selected version is the default, use the index of the default version
                index = songList.findIndex(s => s === selectedVersionPath); // Get the index of the selected version
                setIndex = index; // Set setIndex to the index of the normal song
            } else {
                // If the selected version is not the default, use the index of the normal song
                index = songList.findIndex(s => s === defaultVersionPath);
                setIndex = index; // Set setIndex to the index of the normal song
            }

            // Pass index and setIndex to startGame
            console.log(`setIndex: ${setIndex}, index: ${index}`);
            resetSongVariables();
            startGame(index, selectedVersionPath, setIndex);

            selectedSongModal.style.display = "none"; // Close modal after starting the game
            activateKeybinds();
            saveRecentSong(selectedVersionPath, songTitle, index + 1, songArtist); // Save the recent song
            updateRecentSongButton(); // Update the button text
        });
    }
}

// Modify filterSongs function to handle the Easter eggs and version selection
function filterSongs() {
    const searchInput = document.getElementById("songSearchInput").value.trim().toLowerCase();
    const songButtons = document.querySelectorAll(".song-button");
    const resultsForSearch = document.getElementById("resultsForSearch");
    const noResultsTXT = document.getElementById("noResultsTXT");
    let resultsCount = 0;

    songButtons.forEach(button => {
        const songText = button.textContent.toLowerCase();
        const isKanye = songText.includes("kanye west");
        const isKendrick = songText.includes("kendrick lamar");
        const isEminem = songText.includes("eminem");
        const isCreo = songText.includes("creo");
        const isTravis = songText.includes("travis");
        const isLinkin = songText.includes("linkin park");
        const isTrash = songText.includes("playboi carti");
        const isBillie = songText.includes("billie eilish");
        const isZesty = songText.includes("drake");

        if (searchInput === "ye" && isKanye) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "kdot" && isKendrick) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "em" && isEminem) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "goat" && (isKanye || isKendrick || isEminem || isCreo || isTravis || isLinkin)) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "got bit by a goat" && isEminem) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "marshall" && isEminem) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "marshall mathers" && isEminem) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "trash" && isTrash) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "zesty" && isZesty) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "zest" && isZesty) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "zes" && isZesty) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "ze" && isZesty) {
            button.style.display = "block";
            resultsCount++;
        } else if (searchInput === "bili" && isBillie) {
            button.style.display = "block";
            resultsCount++;
        } else if (songText.includes(searchInput)) {
            button.style.display = "block";
            resultsCount++;
        } else {
            button.style.display = "none";
        }
    });

    // Adjust resultsForSearch display and padding
    if (searchInput) {
        if (resultsCount > 0) {
            resultsForSearch.textContent = `${resultsCount} results found for "${searchInput}"`;
            resultsForSearch.style.display = "block";
            resultsForSearch.style.paddingBottom = "20px"; // Adjust this value to create space similar to <br><br>
            noResultsTXT.style.display = "none";
        } else {
            resultsForSearch.style.display = "none";
            noResultsTXT.style.display = "block";
        }
    } else {
        resultsForSearch.style.display = "none";
        noResultsTXT.style.display = "none";
    }
}

function closeSelectedSongModal() {
    selectedSongModal.style.display = "none";
    songListModal.style.display = "block";
}

function openSongList() {
    document.getElementById("songListModal").style.display = "block";
    deactivateKeybinds();
}

function closeSongList() {
    songListModal.style.display = "none";
    activateKeybinds();
}

const closeSSongModal = document.getElementById("closeSelectedSongModal");
const songBTN = document.getElementById("openSongListBTN");

const searchInput = document.getElementById("songSearchInput");
searchInput.addEventListener("input", filterSongs);

const closeSongListBTN = document.getElementById("closeSongListModal");

songBTN.onclick = openSongList;
closeSSongModal.onclick = closeSelectedSongModal;

closeSongListBTN.onclick = closeSongList;

function nextSong() {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    // Increment currentSongIndex and loop back to 0 if it exceeds the array length
    currentSongIndex = (currentSongIndex + 1) % songList.length;

    // Start the game with the next song in the songList array
    startGame(currentSongIndex);
}

function restartSong() {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    console.log("Restarting song with currentSongIndex: " + currentSongIndex);

    // Check if the current song path matches any of the version paths
    let versionPath = null;
    let indexSet = currentSongIndex;

    for (const [songTitle, versions] of Object.entries(songVersions)) {
        console.log("Checking song title: " + songTitle);
        for (const version of versions) {
            console.log("Checking version path: " + version.path);
            if (version.path === currentSongPath) {
                versionPath = version.path;
                break;
            }
        }
        if (versionPath) {
            break;
        }
    }

    if (versionPath) {
        console.log("Restarting with matched version path: " + versionPath);
        startGame(-1, versionPath, indexSet);
    } else {
        console.log("No matching version path found. Restarting with currentSongIndex: " + currentSongIndex);
        startGame(currentSongIndex);
    }
}

function legacyRestartSong() {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    console.log("Restarting song: " + currentSongIndex);
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
    clearInterval(speedUpdater);

    // Reset dynamic speed variables
    dynamicSpeedInfo = "";
    nextSpeedChange = "";
    currentConfigIndex = 0;
}

function displaySongInfo(setIndex) {
    // Determine the index to display based on setIndex
    indexToDisplay = setIndex >= 0 ? setIndex : currentSongIndex;

    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Song ${indexToDisplay + 1}: ${getSongTitle(currentSong.src)}`, WIDTH - 10, 28);
    ctx.fillText(getArtist(currentSong.src), WIDTH - 10, 56);
    ctx.font = "22px Arial";
    ctx.fillText("BPM: " + BPM + " / Speed: " + noteSpeed, WIDTH - 10, 84);
}

function getSongTitle(songPath) {
    // Ensure songPath is a string
    if (typeof songPath !== "string") {
        console.log("songPath is not a string:", songPath);
        return songPath;
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
        "Die For You": "VALORANT, Grabbitz",
        "Father Stretch My Hands": "Kanye West",
        "Betty (Get Money)": "Yung Gravy",
        "BURN IT DOWN": "Linkin Park",
        "Aleph 0": "LeaF",
        "Better Days": "LAKEY INSPIRED",
        KOCMOC: "SLEEPING HUMMINGBIRD",
        "kompa pasion": "frozy",
        "Legends Never Die": "League Of Legends, Against The Current",
        "Star Walkin": "Lil Nas X",
        "What I've Done": "Linkin Park",
        "Biggest NCS Songs": "NoCopyrightSounds",
        Goosebumps: "Travis Scott, Kendrick Lamar",
        "Master Of Puppets (Live)": "Metallica",
        Numb: "Linkin Park",
        "sdp interlude": "Travis Scott",
        "Shiawase (VIP)": "Dion Timmer",
        VVV: "mikeysmind, Sanikwave",
        "Sleepwalker X Icewhxre": "akiaura, Lumi Athena",
        "WTF 2": "Ugovhb, EF",
        VISIONS: "VALORANT, eaJ, Safari Riot",
        "Stressed Out": "twenty one pilots",
        "Ticking Away": "VALORANT, Grabbitz, bbno$",
        "MY EYES": "Travis Scott",
        "Can't Slow Me Down": "MIRANI, IIIBOI, GroovyRoom, VALORANT",
        LUNCH: "Billie Eilish",
        "BUTTERFLY EFFECT": "Travis Scott",
        SWIM: "Chase Atlantic",
        "You Need Jesus": "Yung Gravy, bbno$",
        Crazy: "Creo",
        Despacito: "Luis Fonsi",
        "FE!N": "Travis Scott, Playboi Carti",
        Nautilus: "Creo",
        Levitating: "Dua Lipa, DaBaby",
        "Somewhere I Belong": "Linkin Park",
        "From The Inside": "Linkin Park",
        Faint: "Linkin Park",
        "Breaking The Habit": "Linkin Park",
        "I Wonder": "Kanye West",
        Godzilla: "Eminem, Juice WRLD",
        "HIGHEST IN THE ROOM": "Travis Scott",
        Runaway: "Kanye West",
        "Rush E": "M.J. Kelly",
        "Vamp Anthem": "Playboi Carti",
        CARNIVAL: "¥$, Kanye West, Ty Dolla $ign, Rich The Kid, Playboi Carti",
        "HUMBLE.": "Kendrick Lamar",
        "Stop Breathing": "Playboi Carti",
        "CHEGOU 3": "shonci, Mc Magrinho",
        "KRUSH ALERT": "shonci, HR",
        BAIXO: "xxanteria",
        "MOVE YO BODY": "Bryansanon",
        "SLAY!": "Eternxlkz",
        "ROCK THAT SHIT!": "asteria",
        "CUTE DEPRESSED": "Dyan Dxddy",
        "LOOK DON'T TOUCH": "Odetari",
        "YOU'RE TOO SLOW": "Odetari",
        BAND4BAND: "Central Cee, Lil Baby",
        "Slide da Treme Melódica v2": "DJ FNK, Polaris",
        fantasmas: "Humbe",
        BIKE: "tanger",
        ARCÀNGEL: "Bizarrap, Arcàngel",
        TELEKINESIS: "Travis Scott, SZA, Future",
        "Bleed it out": "Linkin Park",
        Grenade: "Bruno Mars",
        "24K Magic": "Bruno Mars",
        Finesse: "Bruno Mars",
        "Not Like Us": "Kendrick Lamar",
        "Type Shit": "Future, Metro Boomin, Travis Scott, Playboi Carti",
        "Like That": "Future, Metro Boomin, Kendrick Lamar",
        "That's What I Like": "Bruno Mars",
        Renaissance: "Eminem",
        Habits: "Eminem, White Gold",
        Trouble: "Eminem",
        "Brand New Dance": "Eminem",
        Evil: "Eminem",
        Lucifer: "Eminem, Sly Pyper",
        Antichrist: "Eminem",
        Fuel: "Eminem, JID",
        "Road Rage": "Eminem, Dem Jointz, Sly Pyper",
        Houdini: "Eminem",
        "Guilty Conscience 2": "Eminem",
        "Head Honcho": "Eminem, Ez Mil",
        Temporary: "Eminem, Skylar Grey",
        "Bad One": "Eminem, White Gold",
        Tobey: "Eminem, Big Sean, BabyTron",
        "Somebody Save Me": "Eminem, Jelly Roll",
        "this is what space feels like": "JVKE",
        "SICKO MODE": "Travis Scott, Drake",
        "THE SCOTTS": "THE SCOTTS, Travis Scott, Kid Cudi",
        "Finesse (feat. Cardi B)": "Bruno Mars, Cardi B",
        "WTF 2 - Slowed": "Ugovhb, EF",
        "WTF 2 - Sped Up": "Ugovhb, EF",
        "Slide da Treme Melódica v2 - Slowed": "DJ FNK, Polaris",
        "Slide da Treme Melódica v2 - Ultra Slowed": "DJ FNK, Polaris",
        "Slide da Treme Melódica v2 - Sped Up": "DJ FNK, Polaris",
        "Goosebumps (feat. 21 Savage)": "Travis Scott, Kendrick Lamar, 21 Savage",
    };
    let songTitle = getSongTitle(songSrc);
    return artists[songTitle] || "N/A";
}

// Adjusted getCover function
function getCover(songPath, deltaTime) {
    const songTitle = getSongTitle(songPath);
    const coverImage = getCoverImage(songTitle);

    let centerX = WIDTH - 190 + 180 / 2;
    let centerY = 92 + 180 / 2;
    let radius = 90;

    // Calculate rotation speed and angle based on deltaTime
    let rotationSpeed = 0.015 * BPM; // Rotation speed is adjusted based on BPM of the current song
    if (vinylRotationEnabled) {
        rotationAngle += rotationSpeed * deltaTime; // Accumulate rotation angle
    }

    if (coverImage) {
        if (circularImageEnabled) {
            rotateImage(ctx, coverImage, centerX, centerY, radius, rotationAngle);
        } else {
            ctx.drawImage(coverImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
        }
    } else {
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
    const coverImage = getCoverImage(songTitle);
    if (coverImage) {
        let centerX = WIDTH - 100; // X-coordinate of the circle center
        let centerY = HEIGHT / 2 + 50; // Y-coordinate of the circle center
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
        let centerY = HEIGHT / 2 + 50;
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
    const songVolumeSlider = document.getElementById("songVolume");
    const hitSoundSlider = document.getElementById("hitSoundSlider");

    songVolumeSlider.value = currentSongVolume * 100;
    hitSoundSlider.value = currentHitSoundVolume * 100;

    console.log("Loaded saved song volume");
    console.log("Loaded saved hit sound volume");

    preloadSongs();
    preloadImages();

    // Settings

    detectAndHandleDevice();
    loadSettings();
    applyDefaultNoteStyle();
    updateKeybindsFields();
    toggleNoteStyleButtonDisplay();
    toggleTimeoutInput();
});

// Function to simulate key press
function simulateKeyPress(key) {
    // Create a new KeyboardEvent with the specified key
    var event = new KeyboardEvent("keydown", { key: key });

    // Dispatch the event to simulate the key press
    document.dispatchEvent(event);
}

window.onload = function () {
    canvas.style.backgroundImage = "url('Resources/BeatzBanner.jpg')";
    canvas.style.backgroundSize = "cover";
    canvas.style.backgroundPosition = "center";

    // Apply the saved blur value from localStorage immediately
    const savedMiscellaneous = JSON.parse(localStorage.getItem("miscellaneous")) || {};
    const savedCustomBackgroundBlur = savedMiscellaneous.customBackgroundBlur || "0px";
    document.getElementById("backdropBlurInput").value = savedCustomBackgroundBlur;
    canvas.style.backdropFilter = `blur(${savedCustomBackgroundBlur})`;

    // Add event listeners to buttons
    document.getElementById("toggleAutoHit").addEventListener("click", toggleAutoHit);
    document.getElementById("nextButton").addEventListener("click", nextSong);
    document.getElementById("restartButton").addEventListener("click", restartSong);
    document.getElementById("previousButton").addEventListener("click", previousSong);
    document.getElementById("randomizeButton").addEventListener("click", randomizeSong);
    document.getElementById("githubRepo").addEventListener("click", toRepo);

    // Add event listener to the start button
    document.getElementById("startButton").onclick = () => {
        startGame();
    };

    // Disable the start button after it's clicked
    var startButton = document.getElementById("startButton");
    startButton.addEventListener("click", function () {
        document.getElementById("startButton").style.display = "none";
    });
};

function togglePause() {
    if (!endScreenDrawn) {
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
            updateCanvas(globalTimestamp);
            console.log("Game Unpaused");
        }
    }
}

function startGame(index, versionPath, setIndex) {
    if (versionPath) {
        currentSongPath = versionPath;
        currentSongIndex = setIndex >= 0 ? setIndex : songList.indexOf(currentSongPath);
    } else {
        if (setIndex >= 0) {
            currentSongPath = songList[setIndex];
            currentSongIndex = setIndex;
        } else if (index >= 0) {
            currentSongIndex = index;
            currentSongPath = songList[index];
        } else {
            var randomSong = pickRandomSong();
            console.log("Randomly selected song:", randomSong);
            currentSongPath = randomSong;
            currentSongIndex = songList.indexOf(currentSongPath);
        }
    }

    console.log(`Starting game with index: ${currentSongIndex}`);
    console.log(`Starting game with songPath: ${currentSongPath}`);

    // Check for default versions in the dropdown
    const versionDropdown = document.getElementById("versionDropdown");

    if (versionDropdown && versionDropdown.value && setIndex === -1 && !versionPath) {
        const selectedSongTitle = versionDropdown.value;
        const songVersionsForSelectedTitle = songVersions[selectedSongTitle];
        if (songVersionsForSelectedTitle) {
            currentSongPath = songVersionsForSelectedTitle[0].path;
            songPath = currentSongPath;
        }
    }

    // Reset autoHitDisableSaving and autoHit when starting a new game
    autoHitDisableSaving = false;
    autoHitEnabled = false;

    // Reset the logging flag for best scores
    bestScoreLogged = {};

    // Reset song-related variables
    resetSongVariables();

    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
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

        // Set notesGenerated to true once notes are generated
        notesGenerated = true;

        const songTitle = getSongTitle(currentSongPath);
        const songConfig = getDynamicSpeed(currentSongPath);

        if (songConfig) {
            console.log(`Dynamic speed configuration found for "${songTitle}"`);
            dynamicSpeedInfo = songConfig.map(config => `Timestamp: ${config.timestamp}, Speed: ${config.noteSpeed}`).join(" | ");
            currentConfigIndex = 0; // Reset currentConfigIndex
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
                        if (nextConfig.savedNotes) {
                            savedNotes = nextConfig.savedNotes;
                            console.log(`Saved current notes for future use: ${nextConfig.timestamp}`);
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
            }, 1); // Check for a speed update every millisecond, for accuracy
        } else {
            console.log(`No dynamic speed configuration for "${songTitle}"`);
            dynamicSpeedInfo = "No dynamic speed configuration found.";
            nextSpeedChange = "No speed changes.";
            currentConfigIndex = 0;
        }

        currentSong.play(); // Start playing the song immediately
        songStartTime = Date.now();
        songStarted = true;
        gamePaused = false;
        gameStarted = true;
        endScreenDrawn = false;

        if (!canvasUpdating) {
            canvasUpdating = true; // Set the flag to indicate the canvas is being updated
            requestAnimationFrame(updateCanvas);
        }

        console.log("Song selected: " + getSongTitle(currentSong.src), "by: " + getArtist(currentSong.src));
        console.log("Current song path:", currentSongPath);
        console.log("Beatz.io loaded and playing. Have Fun!");

        currentSong.addEventListener("ended", songEnd);

        document.getElementById("nextButton").style.display = "inline";
        document.getElementById("restartButton").style.display = "inline";
        document.getElementById("previousButton").style.display = "inline";
        document.getElementById("randomizeButton").style.display = "inline";
        document.getElementById("toggleNoteStyleButton").style.display = "inline";
        document.getElementById("fullscreen").style.display = "inline";
        document.getElementById("keybindsButton").style.display = "inline";
        document.getElementById("myYoutube").style.display = "inline";
        document.getElementById("githubRepo").style.display = "inline";
        document.getElementById("songVol").style.display = "inline";
        document.getElementById("hitSoundVol").style.display = "inline";

        document.getElementById("startButton").style.display = "none";

        // Update the page title
        indexToDisplay = setIndex >= 0 ? setIndex : currentSongIndex;
        document.title = `Song ${indexToDisplay + 1}: ${getSongTitle(currentSongPath)} | Beatz Testing 3.6!`;

        console.log(`indexToDisplay converted in startGame: ${indexToDisplay}`);

        if (document.fullscreenElement) {
            canvas.style.cursor = "none";
            if (!backgroundIsDefault && document.fullscreenElement) {
                canvas.style.background = "url('Resources/BackgroundHtml2.png')";
                canvas.style.backgroundSize = "cover";
                canvas.style.backgroundPosition = "center";
            }
        } else if (!backgroundIsDefault && !document.fullscreenElement) {
            canvas.style.background = "transparent"; // If the background is transparent, when fullscreen is toggled off, make the canvas transparent again
            canvas.style.cursor = "default";
        }
    };
}

function songEnd() {
    endScreenDrawn = true;
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

function drawEndScreen() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    canvasUpdating = false;

    endScreenDrawn = true;

    if (backgroundIsDefault) {
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

    // Get the artist(s)
    let artists = getArtist(currentSongPath).split(", ");
    if (artists.length > 3) {
        ctx.fillText("Artist: " + artists.slice(0, 3).join(", ") + ",", WIDTH - 100, HEIGHT / 2 + 40);
        ctx.fillText(artists.slice(3).join(", "), WIDTH - 100, HEIGHT / 2 + 80);
        ctx.fillText("BPM: " + BPM, WIDTH - 100, HEIGHT / 2 + 120);
        ctx.fillText("Speed: " + noteSpeed, WIDTH - 100, HEIGHT / 2 + 160);
    } else {
        ctx.fillText("Artist: " + artists.join(", "), WIDTH - 100, HEIGHT / 2 + 40);
        ctx.fillText("BPM: " + BPM, WIDTH - 100, HEIGHT / 2 + 80);
        ctx.fillText("Speed: " + noteSpeed, WIDTH - 100, HEIGHT / 2 + 120);
    }

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
let globalTimestamp;

let debugInfoVisible = false;

// Function to toggle debug info visibility
function toggleDebugInfo() {
    debugInfoVisible = !debugInfoVisible;
}

let newestNoteType = "";
let newestNoteTime = 0;

var indexToDisplay;

function updateDebugInfo(deltaTime, timestamp) {
    if (debugInfoVisible) {
        const lineHeight = 18;
        const startY = HEIGHT / 2 - 180; // Starting y-coordinate for the first text
        const left = parseFloat(noteYPositions.left);
        const up = parseFloat(noteYPositions.up);
        const down = parseFloat(noteYPositions.down);
        const right = parseFloat(noteYPositions.right);

        // Calculate FPS
        let currentFPS = 1 / deltaTime;
        fps = currentFPS.toFixed(1);

        ctx.font = "11px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText(`Version: ${VERSION}`, 10, startY);
        ctx.fillText(`Device: ${userDevice}`, 10, startY + lineHeight);
        ctx.fillText(`Delta Time: ${deltaTime.toFixed(3)} seconds`, 10, startY + 2 * lineHeight);
        ctx.fillText(`Timestamp: ${timestamp} milliseconds`, 10, startY + 3 * lineHeight);
        ctx.fillText(`Current FPS: ${fps}`, 10, startY + 4 * lineHeight);
        ctx.fillText(`Current song path: ${currentSongPath}`, 10, startY + 5 * lineHeight);
        ctx.fillText(`Current song source:`, 10, startY + 6 * lineHeight);
        ctx.fillText(`${currentSong.src}`, 10, startY + 7 * lineHeight);
        ctx.fillText(`Hit sound index: ${currentHitSoundIndex}`, 10, startY + 8 * lineHeight);
        ctx.fillText(`Song start time: ${songStartTime}`, 10, startY + 9 * lineHeight);
        ctx.fillText(`Song paused time: ${songPausedTime}`, 10, startY + 10 * lineHeight);
        ctx.fillText(`Newest note: ${newestNoteType}, at timestamp: ${newestNoteTime.toFixed(3)}`, 10, startY + 11 * lineHeight);
        ctx.fillText(`Note Y positions: ${left.toFixed(1)} | ${up.toFixed(1)} | ${down.toFixed(1)} | ${right.toFixed(1)}`, 10, startY + 12 * lineHeight);
        ctx.fillText(`Last perfect note type: ${lastPerfectHitNoteType}`, 10, startY + 13 * lineHeight);
        ctx.fillText(`Last early/late note type: ${lastEarlyLateNoteType}`, 10, startY + 14 * lineHeight);
        ctx.fillText(`Last note type: ${lastNoteType}`, 10, startY + 15 * lineHeight);
        ctx.fillText(`Total notes hit in this playthrough: ${notesHit}`, 10, startY + 16 * lineHeight);
        ctx.fillText(`Auto hit disabled saving? ${autoHitDisableSaving}`, 10, startY + 17 * lineHeight);
        ctx.fillText(`Dynamic speeds for ${getSongTitle(currentSongPath)}: ${dynamicSpeedInfo}`, 10, startY + 18 * lineHeight);
        ctx.fillText(nextSpeedChange, 10, startY + 19 * lineHeight);
        ctx.fillText(`Dynamic Speed index: ${currentConfigIndex}`, 10, startY + 20 * lineHeight);
        ctx.fillText(`Saved notes: ${savedNotes}`, 10, startY + 21 * lineHeight);
        ctx.fillText(`Index to Display: ${indexToDisplay + 1}`, 10, startY + 22 * lineHeight);

        ctx.font = "14px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`Control + Shift + H`, WIDTH - 10, startY + 10 * lineHeight);
        ctx.fillText(`To open Hitbox View`, WIDTH - 10, startY + 11 * lineHeight);
    }
}

let backgroundIsDefault = true; // Default to true assuming default background

function updateCanvas(timestamp, setIndex) {
    if (!lastTime) {
        lastTime = timestamp;
    }

    // Calculate the time difference between frames
    timeDelta = (timestamp - lastTime) / 1000; // timeDelta in seconds
    lastTime = timestamp;

    globalTimestamp = timestamp;

    if (gamePaused) {
        // Calculate the time difference between frames
        let timeDelta = (timestamp - lastTime) / 1000; // timeDelta in seconds
        lastTime = timestamp;

        if (!pausedTextDrawn) {
            // Draw "Game Paused" text
            ctx.fillStyle = "red";
            ctx.font = "60px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Game Paused", WIDTH / 2, HEIGHT / 2);
            pausedTextDrawn = true;
        }
        return;
    }
    if (endScreenDrawn === true) {
        // In case dynamic speeds end the song earlier
        onSongEnd();
        return; // Stop updating canvas
    }

    endScreenDrawn = false;

    pausedTextDrawn = false;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (backgroundIsDefault) {
        // If the background selected is transparent or custom
        ctx.drawImage(BGbright, 0, 0, 1280, 720);
    }

    ctx.drawImage(noteLeftIMG, noteXPositions.left - noteWidth / 2, 550, noteWidth, noteHeight);
    ctx.drawImage(noteUpIMG, noteXPositions.up - noteWidth / 2 + 15, 550, noteWidth, noteHeight);
    ctx.drawImage(noteDownIMG, noteXPositions.down - noteWidth / 2 - 15, 550, noteWidth, noteHeight);
    ctx.drawImage(noteRightIMG, noteXPositions.right - noteWidth / 2, 550, noteWidth, noteHeight);

    if (isNewPlayer) {
        switch (tutorialStage) {
            case 0:
                ctx.textAlign = "center";
                ctx.font = "22px Arial";
                ctx.fillText(keybindsText.initial.left, noteXPositions.left, 540);
                ctx.fillText(keybindsText.initial.up, noteXPositions.up + 16, 540);
                ctx.fillText(keybindsText.initial.down, noteXPositions.down - 16, 540);
                ctx.fillText(keybindsText.initial.right, noteXPositions.right, 540);
                break;
            case 1:
                ctx.textAlign = "center";
                ctx.font = "22px Arial";
                ctx.fillText(keybindsText.customizable, WIDTH / 2, 510);
                break;
            case 2:
                ctx.textAlign = "center";
                ctx.font = "22px Arial";
                ctx.fillText(keybindsText.followMe.announce, WIDTH / 2, 510);
                break;
            case 3:
                ctx.textAlign = "center";
                ctx.font = "22px Arial";
                ctx.fillText(keybindsText.followMe.twitter, WIDTH / 2, 510);
                break;
            case 4:
                ctx.textAlign = "center";
                ctx.font = "22px Arial";
                ctx.fillText(keybindsText.followMe.yt, WIDTH / 2, 510);
                break;
            case 5:
                ctx.textAlign = "center";
                ctx.font = "22px Arial";
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

    indexToDisplay = setIndex > -1 ? setIndex : currentSongIndex;

    displaySongInfo(setIndex);
    getCover(currentSongPath, timeDelta);

    if (songStarted) {
        let currentTime = Date.now() - songStartTime;

        // Spawn notes based on timestamps
        for (let i = 0; i < notes.length; i++) {
            let note = notes[i];
            if (note.time <= currentTime && note.time + 1000 > currentTime) {
                if (
                    noteYPositions[note.type].length === 0 ||
                    HEIGHT - noteYPositions[note.type][noteYPositions[noteYPositions[note.type].length - 1]] >= MIN_NOTE_GAP
                ) {
                    noteYPositions[note.type].push(-noteHeight);

                    newestNoteType = note.type;
                    newestNoteTime = note.time;
                }
            }
        }

        drawMovingNotes(timeDelta);

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

        if (!canvasUpdating) {
            console.log("Canvas stopped updating.");
            return;
        }
    }
    requestAnimationFrame(timestamp => updateCanvas(timestamp, setIndex));
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
        noteYPositions[type] = noteYPositions[type].filter(yPos => yPos <= HEIGHT);
    }
    updateNotes(timeDelta);
}

function autoHitPerfectNotes() {
    // Hit notes perfectly, disables point saving after a song ends
    for (let type in noteYPositions) {
        for (let i = 0; i < noteYPositions[type].length; i++) {
            let yPos = noteYPositions[type][i];
            if (yPos >= Math.random() * (PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN) + PERFECT_HIT_RANGE_MIN - 2) {
                // if (yPos >= PERFECT_HIT_RANGE_MIN + 9) {
                triggerHit(type);
                break;
            }
        }
    }
}

function triggerHit(type) {
    // So the note changes to pressed for 0.1 seconds
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
    // Makes the pressed note image appear on top of the normal note
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

function checkHit(noteType) {
    // Checks if you have hit a note, and adds it to your stats in-game
    for (let i = 0; i < noteYPositions[noteType].length; i++) {
        let yPos = noteYPositions[noteType][i];
        if (yPos >= HIT_Y_RANGE_MIN && yPos <= HIT_Y_RANGE_MAX) {
            // If the moving note is in range to hit
            if (yPos >= PERFECT_HIT_RANGE_MIN && yPos <= PERFECT_HIT_RANGE_MAX) {
                // If the moving note is in range to hit perfectly
                points += 1; // Increment by 1 point for perfect hit
                perfectHits++; // Add a perfect hit to your score
                perfectText.active = true; // Enable perfect text
                perfectText.timer = 500; // Set timer for perfect text (0.5 seconds)
                lastPerfectHitNoteType = noteType; // Store the last perfect hit note type, used for debug view

                // Trigger animation on perfect hit, an animation has yet not been added, will add a proper pulse animation in further updated
                notePulsing = true;
                // Set a timer to stop the animation after 0.25 seconds (250 milliseconds)
                setTimeout(() => {
                    notePulsing = false;
                }, 200);
            } else {
                // If you have hit the note really early or really lately
                points += 0.5; // Increment by 0.5 points for early or late hit
                earlyLateHits++; // Add an early/late hit to your score
                earlyLateText.active = true; // Enable early/late text
                earlyLateText.timer = 500; // Set timer for early/late text (0.5 seconds)
                lastEarlyLateNoteType = noteType; // Store the last early/late hit note type, used for debug view
            }

            // Update streaks
            currentStreak++;
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }

            notesHit++; // Used for tutorial stage, after 4 notes hit, cycle the stage
            if (notesHit === 4) {
                tutorialStage = 1;
                cycleTutorialStages();
            }

            lastNoteType = noteType; // Used for debug view

            noteYPositions[noteType].splice(i, 1); // Delete the note after its been hit to prepare for a new one to spawn
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
        const interval = tutorialStage === 2 || tutorialStage === 3 || tutorialStage === 4 ? 2000 : 5000;
        setTimeout(() => {
            tutorialStage++;
            cycleTutorialStages();
        }, interval);
    } else if (tutorialStage === 6) {
        setTimeout(() => {
            tutorialStage = 0;
            isNewPlayer = false; // End the tutorial after the final message
            localStorage.setItem("newPlayer", "true");
        }, 5000);
    }
}

function toggleHitboxes() {
    showHitboxes = !showHitboxes;
}

function toggleCanvasRefresh() {
    if (canvasUpdating) {
        canvasUpdating = false;
    } else if (!canvasUpdating) {
        canvasUpdating = true;
        requestAnimationFrame(updateCanvas);
    }
}

function drawHitboxes() {
    if (showHitboxes) {
        // Draw green hitboxes for stationary notes
        ctx.strokeStyle = "green";
        ctx.strokeRect(noteXPositions.left - noteWidth / 2, HIT_Y_RANGE_MAX - 50, noteWidth, noteHeight);
        ctx.strokeRect(noteXPositions.up - noteWidth / 2 + 15, HIT_Y_RANGE_MAX - 50, noteWidth, noteHeight);
        ctx.strokeRect(noteXPositions.down - noteWidth / 2 - 15, HIT_Y_RANGE_MAX - 50, noteWidth, noteHeight);
        ctx.strokeRect(noteXPositions.right - noteWidth / 2, HIT_Y_RANGE_MAX - 50, noteWidth, noteHeight);

        // Draw red rectangles for the perfect hit range
        ctx.strokeStyle = "red";
        ctx.strokeRect(noteXPositions.left - noteWidth / 2, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);
        ctx.strokeRect(noteXPositions.up - noteWidth / 2 + 15, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);
        ctx.strokeRect(noteXPositions.down - noteWidth / 2 - 15, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);
        ctx.strokeRect(noteXPositions.right - noteWidth / 2, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);
    }
}

function drawMovingNotes(timeDelta) {
    moveNotes(timeDelta);

    drawHitboxes();

    for (let type in noteYPositions) {
        for (let yPos of noteYPositions[type]) {
            let xPos = noteXPositions[type];
            switch (type) {
                case "left":
                    ctx.drawImage(noteLeftIMG, xPos - noteWidth / 2, yPos, noteWidth, noteHeight);
                    if (showHitboxes) {
                        ctx.strokeStyle = "green";
                        ctx.strokeRect(xPos - noteWidth / 2, yPos, noteWidth, noteHeight);
                        ctx.strokeStyle = "rgba(255, 0, 0, 1)"; // Red with full opacity
                        ctx.strokeRect(xPos - noteWidth / 2, yPos + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MAX);
                        ctx.strokeRect(xPos - noteWidth / 2, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);
                    }
                    break;
                case "up":
                    ctx.drawImage(noteUpIMG, xPos - noteWidth / 2 + 15, yPos, noteWidth, noteHeight);
                    if (showHitboxes) {
                        ctx.strokeStyle = "green";
                        ctx.strokeRect(xPos - noteWidth / 2 + 15, yPos, noteWidth, noteHeight);
                        ctx.strokeStyle = "rgba(255, 0, 0, 1)"; // Red with full opacity
                        ctx.strokeRect(xPos - noteWidth / 2 + 15, yPos + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MAX);
                        ctx.strokeRect(xPos - noteWidth / 2 + 15, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);
                    }
                    break;
                case "down":
                    ctx.drawImage(noteDownIMG, xPos - noteWidth / 2 - 15, yPos, noteWidth, noteHeight);
                    if (showHitboxes) {
                        ctx.strokeStyle = "green";
                        ctx.strokeRect(xPos - noteWidth / 2 - 15, yPos, noteWidth, noteHeight);
                        ctx.strokeStyle = "rgba(255, 0, 0, 1)"; // Red with full opacity
                        ctx.strokeRect(xPos - noteWidth / 2 - 15, yPos + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MAX);
                        ctx.strokeRect(xPos - noteWidth / 2 - 15, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);
                    }
                    break;
                case "right":
                    ctx.drawImage(noteRightIMG, xPos - noteWidth / 2, yPos, noteWidth, noteHeight);
                    if (showHitboxes) {
                        ctx.strokeStyle = "green";
                        ctx.strokeRect(xPos - noteWidth / 2, yPos, noteWidth, noteHeight);
                        ctx.strokeStyle = "rgba(255, 0, 0, 1)"; // Red with full opacity
                        ctx.strokeRect(xPos - noteWidth / 2, yPos + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MAX);
                        ctx.strokeRect(xPos - noteWidth / 2, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);
                    }
                    break;
            }
        }
    }
}

function checkMisses() {
    // Checks wether you've missed a note, sometimes doesn't register in low framerates and high note speed, working on a fix
    for (let type in noteYPositions) {
        for (let i = 0; i < noteYPositions[type].length; i++) {
            let yPos = noteYPositions[type][i];
            if (yPos > HIT_Y_RANGE_MAX + 90) {
                noteYPositions[type].splice(i, 1);
                totalMisses++; // Increment total misses when a note is missed
                points--; // Decrease total points when a note is missed

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

    // Set autoHitDisableSaving to true when autoHit is enabled, only disables after you exit the song
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

// Global variable to track if notes are generated
let notesGenerated = false;

function generateRandomNotes(duration) {
    // Function to generate random notes over a given duration
    console.log("Generating notes for duration:", duration); // Log the duration for which notes are being generated
    const notes = []; // Initialize an empty array to hold the generated notes
    const noteTypes = ["left", "down", "up", "right"]; // Define the possible note types
    let lastNoteTime = -MIN_NOTE_GAP; // Initialize the last note time to ensure the first note can be placed
    let lastNoteType = null; // Initialize the last note type to track the type of the previous note

    for (let time = 0; time < duration; time += MILLISECONDS_PER_BEAT) {
        // Loop over the duration in steps of MILLISECONDS_PER_BEAT to place notes
        let type;
        do {
            // Randomly select a note type from the noteTypes array
            type = noteTypes[Math.floor(Math.random() * noteTypes.length)];
        } while (type === lastNoteType && time - lastNoteTime < MIN_NOTE_GAP); // Ensure that the same note type is not placed over itself

        notes.push({ type, time }); // Add the note with its type and time to the notes array

        lastNoteTime = time; // Update the last note time and type for the next iteration
        lastNoteType = type;
    }
    // Set notesGenerated to true after generating notes
    notesGenerated = true;
    console.log("Generated notes:", notes); // Log the generated notes
    return notes; // Return the generated notes array to startGame()
}

// - .  .- -- ---  .- -. --. .  .--. . .-. ---  - ..-  -. ---  .-.. ---  ... .- -... . ...  -.--  -. ---  ... .  --.- ..- .  .... .- -.-. . .-.

// Thanks for playing Beatz!
// - GuayabR.
