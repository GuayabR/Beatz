/**
 * Title: Beatz
 * Author: Victor//GuayabR
 * Date: 16/05/2024
 * Version: MOBILE 4.2.4.6 test (release.version.subversion.bugfix)
 * GitHub Repository: https://github.com/GuayabR/Beatz
 **/

// CONSTANTS

const userDevice = detectDeviceType();

const VERSION = "MOBILE 4.2.4.6 (Codename.Release.Version.Subversion.Bugfix)";
var PUBLICVERSION = `4.2! (${userDevice} Port)`;
console.log("Version: " + VERSION);

const canvas = document.getElementById("myCanvas");

const ctx = canvas.getContext("2d");

const WIDTH = 1280;

const HEIGHT = 720;

const noteWidth = 50;

const noteHeight = 50;

const MIN_NOTE_GAP = 775;

const MAX_HIT_SOUNDS = 5;

const baseURL = "https://guayabr.github.io/Beatz/";

const noteXPositions = {
    left: WIDTH / 2 - 110,
    up: WIDTH / 2 - 51,
    down: WIDTH / 2 + 51,
    right: WIDTH / 2 + 110
};

const loadedImages = {};

let notesHit = 0;
let tutorialStage = 0;
let isNewPlayer = !localStorage.getItem("newPlayer");

// Retrieve the keybinds object from localStorage and parse it
var Settings = JSON.parse(localStorage.getItem("keybinds")) || {};

var Miscellaneous = JSON.parse(localStorage.getItem("miscellaneous")) || {};

const tutorialDesktop = {
    initial: {
        left: Settings.left ? Settings.left[0] : "A",
        up: Settings.up ? Settings.up[0] : "W",
        down: Settings.down ? Settings.down[0] : "S",
        right: Settings.right ? Settings.right[0] : "D"
    },
    customizable: "Keybinds are customizable in the gear icon just below the canvas.",
    thankYou: "Thank you for playing Beatz! Enjoy!",
    followMe: {
        announce: "Support me on my socials!",
        twitter: "Twitter: @GuayabR",
        yt: "Youtube: @GuayabR"
    }
};

const tutorialMobile = {
    initial: {
        tap: "Tap the:",
        left: "Red",
        up: "Green",
        down: "Yellow",
        right: "Blue",
        ofScreen: "side of the screen to hit the notes!"
    },
    customizable: "Cosmetic settings are customizable in the gear icon just below the canvas.",
    thankYou: "Thank you for playing Beatz! Mobile. Enjoy!",
    followMe: {
        announce: "",
        twitter: "",
        yt: ""
    }
};

const noteImages = {
    Left: noteLeftIMG,
    Down: noteDownIMG,
    Up: noteUpIMG,
    Right: noteRightIMG
};

const notePressImages = {
    Left: noteLeftPressIMG,
    Down: noteDownPressIMG,
    Up: noteUpPressIMG,
    Right: noteRightPressIMG
};

const useFetch = Miscellaneous.fetchSongs;

const headerElement = document.querySelector("h1");

detectAndHandleDevice();

console.log("Constants loaded.");

// VARIABLES

var timer;

var gameStarted = false;

let isMobile = false;

if (userDevice === "Android" || userDevice === "iOS" || userDevice === "Mobile") {
    isMobile = true;
} else {
    isMobile = false;
}

var textY;

if (isMobile && !isNewPlayer) {
    textY = 670;
    console.log(`mobile but not new`);
} else if (!isMobile && isNewPlayer) {
    textY = 670;
    console.log(`new but not mobile`);
} else if (!isMobile && !isNewPlayer) {
    textY = 670;
    console.log(`regular`);
} else {
    textY = HEIGHT / 2;
    console.log(`mobile and new`);
}

let songPaths;

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

var MISS_RANGE = 690;

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
    right: []
};

var perfectText = {
    active: false,
    timer: 0
};

var earlyLateText = {
    active: false,
    timer: 0
};

var missText = {
    active: false,
    timer: 0
};

var lastPerfectHitNoteType = null;
var lastEarlyLateNoteType = null;
var lastNoteType = null;

let canvasUpdating = false;

let autoHitDisableSaving = false; // Flag to disable score saving if autoHit has been enabled

let bestScoreLogged = {};

var speedChanges;

var nextSpeedChange;

let backgroundIsDefault = true; // Default to true assuming default background

let fpsBuffedHitRanges = false;

let newestNoteType = "";
let newestNoteTime = 0;

var indexToDisplay;

let gamePaused = false;
let pausedTextDrawn = false;
let endScreenDrawn = false;

// Initialize variables for time tracking
let lastTime = 0;
let timeDelta = 0;
let lastFrameTime = 0;
let FPS = 0;
let globalTimestamp;

let debugInfoVisible = false;

let songMetadataLoaded = false; // Flag to track if song metadata is loaded

// Initialize variables
let rotationAngle = 0; // Initial rotation angle
let vinylRotationEnabled = false; // Initial rotation state
let circularImageEnabled = false; // Initial circular image state

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
    hitSounds.forEach((hitSound) => {
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
        clickHit: "Resources/SFX/Mouse Click.mp3"
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

let currentIndex = 0;

// Function to load songs from remote server
function loadRemoteSong() {
    if (currentIndex < totalSongs) {
        const songPath = songPaths[currentIndex];
        const songTitle = getSongTitle(songPath);

        fetch(songPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch song: ${response.status} ${response.statusText}`);
                }
                return response.blob();
            })
            .then((blob) => {
                // Handle successful response
                songList.push(songPath);
                console.log("Fetched song:", songTitle);
                songLoadCounter++;
                currentIndex++;
                counterText.textContent = ` (${songLoadCounter}/${totalSongs} songs loaded)`;
                addSongToList(songPath, songTitle);
                loadNextSong();
                checkAllSongsLoaded(totalSongs);
            })
            .catch((error) => {
                logError(`Failed to fetch song ${songTitle}: ${error.message}`);
                currentIndex++;
                songLoadCounter++;
                counterText.textContent = ` (${songLoadCounter}/${totalSongs} songs loaded)`;
                loadNextSong();
                checkAllSongsLoaded(totalSongs);
            });
    }
}

// Function to load songs from local resources
function loadLocalSong() {
    if (currentIndex < totalSongs) {
        const songPath = songPaths[currentIndex];
        const songTitle = getSongTitle(songPath);

        const audio = new Audio();
        audio.src = songPath;
        audio.oncanplaythrough = function () {
            songList.push(songPath);
            console.log("Loaded song:", songTitle);
            songLoadCounter++;
            currentIndex++;
            counterText.textContent = ` (${songLoadCounter}/${totalSongs} songs loaded)`;
            addSongToList(songPath, songTitle);
            loadNextSong();
            checkAllSongsLoaded(totalSongs);
        };
        audio.onerror = function () {
            logError(`Failed to load song ${songTitle}`);
            currentIndex++;
            songLoadCounter++;
            counterText.textContent = ` (${songLoadCounter}/${totalSongs} songs loaded)`;
            loadNextSong();
            checkAllSongsLoaded(totalSongs);
        };
    }
}

function addSongToList(songPath, songTitle) {
    const songListContainer = document.getElementById("songList");

    const songButton = document.createElement("button");
    songButton.className = "song-button";
    const currentIndex = songListContainer.childElementCount; // Get current count of child elements

    // Get album information if available
    let album = songToAlbumMap[songTitle] || "Unknown Album";

    // If the album matches the song title, display "Single" instead of the album name
    if (album.toLowerCase() === songTitle.toLowerCase()) {
        album = "Single";
    }

    // Check if the song title ends with a dot
    if (songTitle.endsWith(".")) {
        songButton.textContent = `${album} | Song ${currentIndex + 1}: ${songTitle} by ${getArtist(songTitle)}.`;
    } else {
        songButton.textContent = `${album} | Song ${currentIndex + 1}: ${songTitle}, by ${getArtist(songTitle)}.`;
    }

    songButton.dataset.path = songPath; // Store song path as a data attribute
    songButton.dataset.index = currentIndex; // Store song index as a data attribute
    songListContainer.appendChild(songButton);

    songButton.onclick = function () {
        openSelectedSongModal(songPath, songTitle);
    };

    // Store song path and title for filtering
    listOfSongs.push({ path: songPath, title: songTitle });

    console.log(`Song added to list: ${songTitle} - ${songPath}`);
}

// Function to preload songs
function preloadSongs() {
    if (useFetch) {
        console.warn(`Fetching songs from guayabr.github.io, fetching: ${useFetch}`);
        songPaths = [
            "https://guayabr.github.io/Beatz/Resources/Songs/Epilogue.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Exosphere.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Die For You.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Father Stretch My Hands.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Betty (Get Money).mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/BURN IT DOWN.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Aleph 0.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Better Days.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/kompa pasion.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/KOCMOC.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Legends Never Die.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Star Walkin.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/What I've Done.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Biggest NCS Songs.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Goosebumps.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Sleepwalker X Icewhxre.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Numb.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/sdp interlude.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Shiawase (VIP).mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Master Of Puppets (Live).mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Stressed Out.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Ticking Away.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/VISIONS.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/24.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/WTF 2.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Somewhere I Belong.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Can't Slow Me Down.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/LUNCH.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/BUTTERFLY EFFECT.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/SWIM.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/FE!N.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Crazy.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Despacito.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/You Need Jesus.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Nautilus.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Levitating.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/MY EYES.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Faint.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Breaking The Habit.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/From The Inside.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/I Wonder.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Godzilla.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/HIGHEST IN THE ROOM.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Runaway.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Fire Again.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Vamp Anthem.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/CARNIVAL.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/HUMBLE..mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Stop Breathing.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/CHEGOU 3.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/KRUSH ALERT.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/CUTE DEPRESSED.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/MOVE YO BODY.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/SLAY!.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/ROCK THAT SHIT!.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/BAIXO.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/LOOK DON'T TOUCH.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/YOU'RE TOO SLOW.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/BAND4BAND.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Slide da Treme Melódica v2.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/fantasmas.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/BIKE.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/ARCÀNGEL.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/TELEKINESIS.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Bleed it out.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Grenade.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/24K Magic.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Finesse.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Not Like Us.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Type Shit.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Like That.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/That's What I Like.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Renaissance.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Habits.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Trouble.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Brand New Dance.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Evil.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Lucifer.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Antichrist.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Fuel.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Road Rage.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Houdini.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Guilty Conscience 2.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Head Honcho.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Temporary.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Bad One.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Tobey.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Somebody Save Me.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/this is what space feels like.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/SICKO MODE.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/THE SCOTTS.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/The Automotivo Infernal 1.0.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/WAKE UP!.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Flashing Lights.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/RUN!.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/THE DINER.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Babooshka.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Your Girl.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Brand New City.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Vivir Mi Vida.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Idols.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/aruarian dance.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/VVV.mp3",
            "https://guayabr.github.io/Beatz/Resources/Songs/Magic Touch.mp3"
        ];
    } else {
        console.warn(`Loading songs locally, fetching: ${useFetch}`);

        songPaths = [
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
            "Resources/Songs/24.mp3",
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
            "Resources/Songs/Fire Again.mp3",
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
            "Resources/Songs/The Automotivo Infernal 1.0.mp3",
            "Resources/Songs/WAKE UP!.mp3",
            "Resources/Songs/Flashing Lights.mp3",
            "Resources/Songs/RUN!.mp3",
            "Resources/Songs/THE DINER.mp3",
            "Resources/Songs/Babooshka.mp3",
            "Resources/Songs/Your Girl.mp3",
            "Resources/Songs/Brand New City.mp3",
            "Resources/Songs/Vivir Mi Vida.mp3",
            "Resources/Songs/Idols.mp3",
            "Resources/Songs/aruarian dance.mp3",
            "Resources/Songs/VVV.mp3",
            "Resources/Songs/Magic Touch.mp3",

            "Resources/Songs/testingsong.mp3"
        ];
    }

    currentIndex = 0;
    totalSongs = songPaths.length;

    // Add counter text beside the header
    counterText = document.createElement("span");
    counterText.textContent = ` (${songLoadCounter}/${totalSongs} songs loaded)`;
    headerElement.appendChild(counterText);

    listOfSongs = []; // Initialize the list of songs

    // Start loading the first song
    loadNextSong();
}

function loadNextSong() {
    if (useFetch) {
        loadRemoteSong();
    } else {
        loadLocalSong();
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

const songVersions = {
    Finesse: [
        { path: [`${baseURL}Resources/Songs/Finesse.mp3`], title: "Finesse" },
        { path: [`${baseURL}Resources/Songs/Finesse (feat. Cardi B).mp3`], title: "Finesse (feat. Cardi B)" }
    ],
    "WTF 2": [
        { path: [`${baseURL}Resources/Songs/WTF 2.mp3`], title: "WTF 2" },
        { path: [`${baseURL}Resources/Songs/WTF 2 - Slowed.mp3`], title: "WTF 2 - Slowed" },
        { path: [`${baseURL}Resources/Songs/WTF 2 - Sped Up.mp3`], title: "WTF 2 - Sped Up" }
    ],
    "Slide da Treme Melódica v2": [
        { path: [`${baseURL}Resources/Songs/Slide da Treme Melódica v2.mp3`], title: "Slide da Treme Melódica v2" },
        { path: [`${baseURL}Resources/Songs/Slide da Treme Melódica v2 - Slowed.mp3`], title: "Slide da Treme Melódica v2 - Slowed" },
        { path: [`${baseURL}Resources/Songs/Slide da Treme Melódica v2 - Ultra Slowed.mp3`], title: "Slide da Treme Melódica v2 - Ultra Slowed" },
        { path: [`${baseURL}Resources/Songs/Slide da Treme Melódica v2 - Sped Up.mp3`], title: "Slide da Treme Melódica v2 - Sped Up" }
    ],
    Goosebumps: [
        { path: [`${baseURL}Resources/Songs/Goosebumps.mp3`], title: "Goosebumps" },
        { path: [`${baseURL}Resources/Songs/Goosebumps (feat. 21 Savage).mp3`], title: "Goosebumps (feat. 21 Savage)" }
    ],
    "The Automotivo Infernal 1.0": [
        { path: [`${baseURL}Resources/Songs/The Automotivo Infernal 1.0.mp3`], title: "The Automotivo Infernal 1.0" },
        { path: [`${baseURL}Resources/Songs/The Automotivo Infernal 1.0 - Red.mp3`], title: "The Automotivo Infernal 1.0 - Red" },
        { path: [`${baseURL}Resources/Songs/The Automotivo Infernal 1.0 - Slowed.mp3`], title: "The Automotivo Infernal 1.0 - Slowed" },
        { path: [`${baseURL}Resources/Songs/The Automotivo Infernal 1.0 - Sped Up.mp3`], title: "The Automotivo Infernal 1.0 - Sped Up" },
        { path: [`${baseURL}Resources/Songs/The Automotivo Infernal 1.0 - Red - Slowed.mp3`], title: "The Automotivo Infernal 1.0 - Red - Slowed" },
        { path: [`${baseURL}Resources/Songs/The Automotivo Infernal 1.0 - Red - Sped Up.mp3`], title: "The Automotivo Infernal 1.0 - Red - Sped Up" }
    ]
    // Add other songs and their versions here
};

const songConfigs = {
    Epilogue: { BPM: 160, noteSpeed: 10 },
    Exosphere: { BPM: 118, noteSpeed: 10 },
    "Die For You": { BPM: 95, noteSpeed: 8 },
    "Father Stretch My Hands": { BPM: 113, noteSpeed: 10 },
    "Betty (Get Money)": { BPM: 102, noteSpeed: 8 },
    "BURN IT DOWN": { BPM: 110, noteSpeed: 8 },
    "Aleph 0": { BPM: 125, noteSpeed: 8 },
    "Better Days": { BPM: 132, noteSpeed: 6 },
    KOCMOC: { BPM: 190, noteSpeed: 12 },
    "kompa pasion": { BPM: 98, noteSpeed: 7 },
    "Legends Never Die": { BPM: 140, noteSpeed: 10 },
    "Star Walkin": { BPM: 142, noteSpeed: 9 },
    "What I've Done": { BPM: 120, noteSpeed: 8 },
    "Biggest NCS Songs": { BPM: 110, noteSpeed: 8 },
    Goosebumps: { BPM: 130, noteSpeed: 8 },
    "Master Of Puppets (Live)": { BPM: 210, noteSpeed: 12 },
    Numb: { BPM: 110, noteSpeed: 10 },
    "sdp interlude": { BPM: 108, noteSpeed: 8 },
    "Shiawase (VIP)": { BPM: 150, noteSpeed: 12.2 },
    "Sleepwalker X Icewhxre": { BPM: 120, noteSpeed: 10 },
    "Stressed Out": { BPM: 170, noteSpeed: 8 },
    "Ticking Away": { BPM: 95, noteSpeed: 10 },
    VISIONS: { BPM: 157, noteSpeed: 8 },
    24: { BPM: 98, noteSpeed: 8 },
    "WTF 2": { BPM: 116, noteSpeed: 14 },
    "MY EYES": { BPM: 132, noteSpeed: 12 },
    "Can't Slow Me Down": { BPM: 122, noteSpeed: 11 },
    LUNCH: { BPM: 125, noteSpeed: 14.6 },
    "BUTTERFLY EFFECT": { BPM: 141, noteSpeed: 10 },
    SWIM: { BPM: 120, noteSpeed: 10 },
    "You Need Jesus": { BPM: 110, noteSpeed: 11 },
    Crazy: { BPM: 120, noteSpeed: 10 },
    Despacito: { BPM: 89, noteSpeed: 10 },
    "FE!N": { BPM: 148, noteSpeed: 12 },
    Nautilus: { BPM: 124, noteSpeed: 9 },
    Levitating: { BPM: 103, noteSpeed: 10 },
    "Somewhere I Belong": { BPM: 162, noteSpeed: 10 },
    "From The Inside": { BPM: 95, noteSpeed: 10.5 },
    Faint: { BPM: 135, noteSpeed: 11 },
    "Breaking The Habit": { BPM: 100, noteSpeed: 10 },
    "I Wonder": { BPM: 127, noteSpeed: 10 },
    Godzilla: { BPM: 166, noteSpeed: 13 },
    "HIGHEST IN THE ROOM": { BPM: 156, noteSpeed: 0 },
    Runaway: { BPM: 85, noteSpeed: 10 },
    "Fire Again": { BPM: 100, noteSpeed: 12 },
    "Vamp Anthem": { BPM: 164, noteSpeed: 12 },
    CARNIVAL: { BPM: 148, noteSpeed: 12 },
    "HUMBLE.": { BPM: 150, noteSpeed: 0 },
    "Stop Breathing": { BPM: 155, noteSpeed: 12 },
    "CHEGOU 3": { BPM: 130, noteSpeed: 13.2 },
    "KRUSH ALERT": { BPM: 117, noteSpeed: 12.5 },
    "CUTE DEPRESSED": { BPM: 228, noteSpeed: 16 },
    "MOVE YO BODY": { BPM: 133, noteSpeed: 12 },
    "SLAY!": { BPM: 130, noteSpeed: 13 },
    "ROCK THAT SHIT!": { BPM: 125, noteSpeed: 12 },
    BAIXO: { BPM: 133, noteSpeed: 12 },
    "LOOK DON'T TOUCH": { BPM: 125, noteSpeed: 13 },
    "YOU'RE TOO SLOW": { BPM: 162, noteSpeed: 14.5 },
    BAND4BAND: { BPM: 140, noteSpeed: 14 },
    "Slide da Treme Melódica v2": { BPM: 210, noteSpeed: 18 },
    fantasmas: { BPM: 164, noteSpeed: 10 },
    BIKE: { BPM: 105, noteSpeed: 14 },
    ARCÀNGEL: { BPM: 124, noteSpeed: 14 },
    TELEKINESIS: { BPM: 166, noteSpeed: 12 },
    "Bleed it out": { BPM: 140, noteSpeed: 0 },
    Grenade: { BPM: 110, noteSpeed: 0 },
    "24K Magic": { BPM: 107, noteSpeed: 15 },
    Finesse: { BPM: 105, noteSpeed: 22 },
    "Not Like Us": { BPM: 101, noteSpeed: 0 },
    "Type Shit": { BPM: 145, noteSpeed: 14 },
    "Like That": { BPM: 162, noteSpeed: 16 },
    "That's What I Like": { BPM: 134, noteSpeed: 14 },
    Renaissance: { BPM: 199, noteSpeed: 0 },
    Habits: { BPM: 100, noteSpeed: 10 },
    Trouble: { BPM: 83, noteSpeed: 8 },
    "Brand New Dance": { BPM: 120, noteSpeed: 14 },
    Evil: { BPM: 81, noteSpeed: 10 },
    Lucifer: { BPM: 79, noteSpeed: 8 },
    Antichrist: { BPM: 99, noteSpeed: 10 },
    Fuel: { BPM: 138, noteSpeed: 12 },
    "Road Rage": { BPM: 95, noteSpeed: 10 },
    Houdini: { BPM: 141, noteSpeed: 12 },
    "Guilty Conscience 2": { BPM: 164, noteSpeed: 14 },
    "Head Honcho": { BPM: 173, noteSpeed: 16 },
    Temporary: { BPM: 78, noteSpeed: 8 },
    "Bad One": { BPM: 146, noteSpeed: 14 },
    Tobey: { BPM: 139, noteSpeed: 14 },
    "Somebody Save Me": { BPM: 181, noteSpeed: 16 },
    "this is what space feels like": { BPM: 146, noteSpeed: 11 },
    "SICKO MODE": { BPM: 155, noteSpeed: 0 },
    "THE SCOTTS": { BPM: 130, noteSpeed: 0 },
    "WAKE UP!": { BPM: 125, noteSpeed: 8 },
    "Flashing Lights": { BPM: 90, noteSpeed: 8.5 },
    "RUN!": { BPM: 136, noteSpeed: 10 },
    "THE DINER": { BPM: 125, noteSpeed: 14 },
    Babooshka: { BPM: 103, noteSpeed: 10 },
    "Your Girl": { BPM: 120, noteSpeed: 8 },
    "Brand New City": { BPM: 148, noteSpeed: 12 },
    "Vivir Mi Vida": { BPM: 105, noteSpeed: 10 },
    Idols: { BPM: 130, noteSpeed: 2.65 },
    "aruarian dance": { BPM: 96, noteSpeed: 6 },
    VVV: { BPM: 131, noteSpeed: 10 },
    "Magic Touch": { BPM: 127, noteSpeed: 12 },

    // Song Versions
    "Finesse (feat. Cardi B)": { BPM: 105, noteSpeed: 22 },
    "WTF 2 - Slowed": { BPM: 148, noteSpeed: 12 },
    "WTF 2 - Sped Up": { BPM: 130, noteSpeed: 16 },
    "Slide da Treme Melódica v2 - Slowed.mp3": { BPM: 125, noteSpeed: 16 },
    "Slide da Treme Melódica v2 - Ultra Slowed.mp3": { BPM: 159, noteSpeed: 16 },
    "Slide da Treme Melódica v2 - Sped Up.mp3": { BPM: 157, noteSpeed: 18 },
    "Goosebumps (feat. 21 Savage)": { BPM: 130, noteSpeed: 8 },
    "The Automotivo Infernal 1.0": { BPM: 140, noteSpeed: 12 },
    "The Automotivo Infernal 1.0 - Red": { BPM: 140, noteSpeed: 12 },
    "The Automotivo Infernal 1.0 - Slowed": { BPM: 117, noteSpeed: 12 },
    "The Automotivo Infernal 1.0 - Sped Up": { BPM: 140, noteSpeed: 12 },
    "The Automotivo Infernal 1.0 - Red - Slowed": { BPM: 140, noteSpeed: 12 },
    "The Automotivo Infernal 1.0 - Red - Sped Up": { BPM: 140, noteSpeed: 12 }
};

let savedNotes;

function getDynamicSpeed(songSrc) {
    const dynamicSpeeds = {
        "HIGHEST IN THE ROOM": [
            { timestamp: 12.9, noteSpeed: 25 }, // 0:12 (starting point)
            { timestamp: 13.35, noteSpeed: 12 }, // 0:13.35 (starting point 2)
            { timestamp: 25.9, noteSpeed: 14 }, // 0:26
            { timestamp: 112.8, noteSpeed: 9 } // 1:54.8
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
            { timestamp: 169, noteSpeed: 18.2, endScreenDrawn: true } // Endscreen is drawn before song ends in case song has a long ending without much beat
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
            { timestamp: 163.25, noteSpeed: 18, endScreenDrawn: true }
        ],
        Grenade: [
            { timestamp: 3.95, noteSpeed: 12 },
            { timestamp: 198.8, noteSpeed: 12, notes: [] },
            { timestamp: 216.6, noteSpeed: 12, endScreenDrawn: true }
        ],
        Finesse: [
            { timestamp: 4.85, noteSpeed: 14 },
            { timestamp: 214.5, noteSpeed: 14, endScreenDrawn: true }
        ],
        "Finesse (feat. Cardi B)": [
            { timestamp: 4.85, noteSpeed: 14 },
            { timestamp: 214.5, noteSpeed: 14, endScreenDrawn: true }
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
            { timestamp: 63.94, noteSpeed: 14 }
        ],
        Renaissance: [{ timestamp: 11, noteSpeed: 14 }],
        "HUMBLE.": [
            { timestamp: 6.78, noteSpeed: 12 },
            { timestamp: 7.7, noteSpeed: 14 }
        ],
        "SICKO MODE": [
            { timestamp: 27.6, noteSpeed: 12 }, // sun is down
            { timestamp: 56, noteSpeed: 14 }, // omega bass
            { timestamp: 58.85, noteSpeed: 14, savedNotes: notes },
            { timestamp: 58.9, noteSpeed: 14, notes: [] },
            { timestamp: 64.3, noteSpeed: 14, notes: savedNotes },
            { timestamp: 65, noteSpeed: 14 }
        ],
        "THE SCOTTS": [{ timestamp: 22.2, noteSpeed: 14 }],
        "The Automotivo Infernal 1.0": [
            { timestamp: 8.6, noteSpeed: 14 },
            { timestamp: 13.825, noteSpeed: 8 },
            { timestamp: 15.45, noteSpeed: 18, BPM: 140 * 2 },
            { timestamp: 28.1, noteSpeed: 12, BPM: 140 },
            { timestamp: 29.15, noteSpeed: 14 },
            { timestamp: 34.35, noteSpeed: 12 },
            { timestamp: 36, noteSpeed: 18, BPM: 140 * 2 },
            { timestamp: 49.76, noteSpeed: 12, BPM: 140 },
            { timestamp: 56.64, noteSpeed: 10 },
            { timestamp: 61.81, noteSpeed: 12 },
            { timestamp: 62.2, noteSpeed: 14 },
            { timestamp: 62.6, noteSpeed: 16 },
            { timestamp: 63, noteSpeed: 18 },
            { timestamp: 63.51, noteSpeed: 20, BPM: 140 * 2 },
            { timestamp: 75.49, noteSpeed: 12, BPM: 140 },
            { timestamp: 77.18, noteSpeed: 20, BPM: 140 * 2 },
            { timestamp: 89.17, noteSpeed: 14, BPM: 140 },
            { timestamp: 90.9, noteSpeed: 12 },
            { timestamp: 94.37, noteSpeed: 14 },
            { timestamp: 94.73, noteSpeed: 16 },
            { timestamp: 95.22, noteSpeed: 18 },
            { timestamp: 95.6, noteSpeed: 20 },
            { timestamp: 96.05, noteSpeed: 10 },
            { timestamp: 97.75, noteSpeed: 22, BPM: 140 * 2 },
            { timestamp: 111.51, noteSpeed: 22, endScreenDrawn: true }
        ],
        "The Automotivo Infernal 1.0 - Red": [
            { timestamp: 8.6, noteSpeed: 14 },
            { timestamp: 13.825, noteSpeed: 8 },
            { timestamp: 15.45, noteSpeed: 18, BPM: 140 * 2 },
            { timestamp: 28.1, noteSpeed: 12, BPM: 140 },
            { timestamp: 29.15, noteSpeed: 14 },
            { timestamp: 34.35, noteSpeed: 12 },
            { timestamp: 36, noteSpeed: 18, BPM: 140 * 2 },
            { timestamp: 49.76, noteSpeed: 12, BPM: 140 },
            { timestamp: 56.64, noteSpeed: 10 },
            { timestamp: 61.81, noteSpeed: 12 },
            { timestamp: 62.2, noteSpeed: 14 },
            { timestamp: 62.6, noteSpeed: 16 },
            { timestamp: 63, noteSpeed: 18 },
            { timestamp: 63.51, noteSpeed: 20, BPM: 140 * 2 },
            { timestamp: 75.49, noteSpeed: 12, BPM: 140 },
            { timestamp: 77.18, noteSpeed: 20, BPM: 140 * 2 },
            { timestamp: 89.17, noteSpeed: 14, BPM: 140 },
            { timestamp: 90.9, noteSpeed: 12 },
            { timestamp: 94.37, noteSpeed: 14 },
            { timestamp: 94.73, noteSpeed: 16 },
            { timestamp: 95.22, noteSpeed: 18 },
            { timestamp: 95.6, noteSpeed: 20 },
            { timestamp: 96.05, noteSpeed: 10 },
            { timestamp: 97.75, noteSpeed: 22, BPM: 140 * 2 },
            { timestamp: 111.51, noteSpeed: 22, endScreenDrawn: true }
        ],
        "Flashing Lights": [
            { timestamp: 21.15, noteSpeed: 10.5 },
            { timestamp: 190.923, noteSpeed: 10, endScreenDrawn: true }
        ],
        "WAKE UP!": [
            { timestamp: 15.32, noteSpeed: 16 },
            { timestamp: 30.7, noteSpeed: 17, BPM: 125 * 2 },
            { timestamp: 46, noteSpeed: 12, BPM: 125 },
            { timestamp: 62.4, noteSpeed: 18, BPM: 125 * 2 },
            { timestamp: 77.79, noteSpeed: 20, BPM: 125 * 3 },
            { timestamp: 93, noteSpeed: 16, BPM: 125 },
            { timestamp: 108.4, noteSpeed: 8 },
            { timestamp: 109.9, noteSpeed: 16 },
            { timestamp: 117.09, noteSpeed: 12 },
            { timestamp: 117.6, noteSpeed: 22, BPM: 125 * 3 },
            { timestamp: 132.8, noteSpeed: 22, BPM: 125, notes: [] },
            { timestamp: 136.55, noteSpeed: 22, endScreenDrawn: true }
        ],
        "RUN!": [
            { timestamp: 7.215, noteSpeed: 14 },
            { timestamp: 19.57, noteSpeed: 10 },
            { timestamp: 21.3, noteSpeed: 14 },
            { timestamp: 34.92, noteSpeed: 12 },
            { timestamp: 35.9, noteSpeed: 14 },
            { timestamp: 47.6, noteSpeed: 12 },
            { timestamp: 49.59, noteSpeed: 14 },
            { timestamp: 61.9, noteSpeed: 12 },
            { timestamp: 62.7, noteSpeed: 14 },
            { timestamp: 63.23, noteSpeed: 16 },
            { timestamp: 63.71, noteSpeed: 10 },
            { timestamp: 77.81, noteSpeed: 16 },
            { timestamp: 90.1, noteSpeed: 12 },
            { timestamp: 91.94, noteSpeed: 14 },
            { timestamp: 106, noteSpeed: 10 },
            { timestamp: 120.15, noteSpeed: 18 },
            { timestamp: 132.48, noteSpeed: 14 },
            { timestamp: 133.41, noteSpeed: 16, notes: [] },
            { timestamp: 133.85, noteSpeed: 18 },
            { timestamp: 134.26, noteSpeed: 18, endScreenDrawn: true }
        ],
        "Vivir Mi Vida": [
            { timestamp: 246.7, noteSpeed: 10, notes: [] },
            { timestamp: 249.65, noteSpeed: 10, endScreenDrawn: true }
        ],
        Idols: [
            { timestamp: 3.6, noteSpeed: 10 },
            { timestamp: 11.14, noteSpeed: 12 },
            { timestamp: 18.6, noteSpeed: 18 }
        ],
        testingsong: [
            { timestamp: 1, noteSpeed: 10 },
            { timestamp: 2, noteSpeed: 10, BPM: BPM * 2 },
            { timestamp: 3, noteSpeed: 10, notes: [] },
            { timestamp: 4, noteSpeed: 10, endScreenDrawn: true }
        ]
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
    "Fire Again": "Fire Again",
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
    "WAKE UP!": "WAKE UP!",
    "Flashing Lights": "Graduation",
    "RUN!": "RUN!",
    "THE DINER": "Hit Me Hard and Soft",
    Babooshka: "Never For Ever",
    "Your Girl": "Unreleased",
    "Brand New City": "Lush",
    "Vivir Mi Vida": "Vivir Mi Vida",
    Idols: "Idols",
    24: "Honeymoon",
    "aruarian dance": "samurai champloo music record departure",
    "Magic Touch": "Magic Touch",

    // Song Versions

    "Finesse (feat. Cardi B)": "24K Magic",
    "WTF 2 - Slowed": "WTF 2 - Slowed",
    "WTF 2 - Sped Up": "WTF 2 - Sped Up",
    "Slide da Treme Melódica v2 - Slowed": "Slide da Treme Melódica v2 - Slowed",
    "Slide da Treme Melódica v2 - Ultra Slowed": "Slide da Treme Melódica v2 - Ultra Slowed",
    "Slide da Treme Melódica v2 - Sped Up": "Slide da Treme Melódica v2 - Sped Up",
    "Goosebumps (feat. 21 Savage)": "Birds in the Trap Sing McKnight",
    "The Automotivo Infernal 1.0": "The Automotivo Infernal 1.0",
    "The Automotivo Infernal 1.0 - Red": "The Automotivo Infernal 1.0",
    "The Automotivo Infernal 1.0 - Slowed": "The Automotivo Infernal 1.0",
    "The Automotivo Infernal 1.0 - Sped Up": "The Automotivo Infernal 1.0",
    "The Automotivo Infernal 1.0 - Red - Slowed": "The Automotivo Infernal 1.0",
    "The Automotivo Infernal 1.0 - Red - Sped Up": "The Automotivo Infernal 1.0"
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
        "Resources/Covers/Fire Again.jpg",
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
        "Resources/Covers/WAKE UP!.jpg",
        "Resources/Covers/RUN!.jpg",
        "Resources/Covers/Never For Ever.jpg",
        "Resources/Covers/Unreleased.jpg",
        "Resources/Covers/Lush.jpg",
        "Resources/Covers/Vivir Mi Vida.jpg",
        "Resources/Covers/Idols.jpg",
        "Resources/Covers/Honeymoon.jpg",
        "Resources/Covers/samurai champloo music record departure.jpg",
        "Resources/Covers/Magic Touch.jpg",

        // Song Versions

        "Resources/Covers/WTF 2 - Slowed.jpg",
        "Resources/Covers/WTF 2 - Sped Up.jpg",
        "Resources/Covers/Slide da Treme Melódica v2 - Slowed.jpg",
        "Resources/Covers/Slide da Treme Melódica v2 - Ultra Slowed.jpg",
        "Resources/Covers/Slide da Treme Melódica v2 - Sped Up.jpg",
        "Resources/Covers/The Automotivo Infernal 1.0.jpg"
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
            artist: recentSongArtist
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
        var stringIndex = recentSong.index;
        var index = Number(stringIndex) - 1;
        var setIndex = index;
        var recentSongPath = recentSong.path;
        startGame(index, recentSongPath, setIndex);
        closeSongList();
    } else {
        alert("No recent song found. Select one from the index!");
    }
}

// Event listener for "Play most recent song" button
document.getElementById("mostRecent").addEventListener("click", playRecentSong);

// Update the recent song button on page load
window.addEventListener("load", updateRecentSongButton);

function openSelectedSongModal(songPath, songTitle) {
    const song = songList.find((s) => s === songPath);
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
            const versionConfig = songConfigs[versionTitle] || {};
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
                console.log(`total speed: ${totalNoteSpeed} avrg note speed ${averageNoteSpeed}`);
            } else {
                let noteSpeed = versionConfig.noteSpeed || "Note Speed not available";
                songSpeedElement.textContent = `${noteSpeed}`;
                document.getElementById("speedTXT").innerHTML = `<strong>Note Speed:</strong>`;
            }
        }

        // Set initial modal content
        updateModalContent(songPath, songTitle);

        // Determine default version path
        const defaultVersionPath = songList.find((s) => s === songPath);
        const isDefaultVersion = songPath === defaultVersionPath;

        // Reset version dropdown
        versionDropdown.innerHTML = ""; // Clear existing options
        versionDropdown.selectedIndex = -1; // Reset to no selection

        // Check for song versions
        if (songVersions[songTitle]) {
            versionDropdownContainer.style.display = "block";
            versionDropdownContainer.style.paddingBottom = "20px"; // Adjust this value to create space similar to <br><br>

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
                index = songList.findIndex((s) => s === selectedVersionPath); // Get the index of the selected version
                setIndex = index; // Set setIndex to the index of the normal song
            } else {
                // If the selected version is not the default, use the index of the normal song
                index = songList.findIndex((s) => s === defaultVersionPath);
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
    let firstVisibleButton = null; // To store the first visible song button

    // Find the last song index
    const lastSongIndex = songList.length;

    songButtons.forEach((button) => {
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
        const isMRL = songText.includes("mrl");
        const isLastSong = songText.includes(lastSongIndex);

        if (searchInput === "ye" && isKanye) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
            resultsCount++;
        } else if (searchInput === "kdot" && isKendrick) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
            resultsCount++;
        } else if (searchInput === "em" && isEminem) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
            resultsCount++;
        } else if (searchInput === "goat" && (isKanye || isKendrick || isEminem || isCreo || isTravis || isLinkin || isMRL)) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
            resultsCount++;
        } else if (searchInput === "got bit by a goat" && isEminem) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
            resultsCount++;
        } else if (searchInput === "marshall" && isEminem) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
            resultsCount++;
        } else if (searchInput === "marshall mathers" && isEminem) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
            resultsCount++;
        } else if (searchInput === "trash" && isTrash) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
            resultsCount++;
        } else if (searchInput === "zesty" && isZesty) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
            resultsCount++;
        } else if (searchInput === "bili" && isBillie) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
            resultsCount++;
        } else if (searchInput === "last" && isLastSong) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
            resultsCount++;
        } else if (songText.includes(searchInput)) {
            button.style.display = "block";
            if (!firstVisibleButton) firstVisibleButton = button;
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

    // Return the first visible button for use in playFirstResult
    return firstVisibleButton;
}

function playFirstResult() {
    const firstButton = filterSongs(); // Call filterSongs to get the first visible song button

    if (firstButton) {
        const songIndex = firstButton.dataset.index; // Get the stored index from the data attribute

        if (songIndex !== undefined) {
            startGame(parseInt(songIndex)); // Call startGame with the extracted song index
            closeSongList(); // Close the song list
        } else {
            console.error("No index found on the first visible button.");
        }
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

// Global cooldown management
let lastFunctionCallTime = 0;
const COOLDOWN_PERIOD = 100; // Cooldown period in milliseconds

function canActivate() {
    const currentTime = Date.now();
    if (currentTime - lastFunctionCallTime < COOLDOWN_PERIOD) {
        console.log("Cooldown in effect. Please wait before calling another function.");
        return false;
    }
    lastFunctionCallTime = currentTime;
    return true;
}

function nextSong() {
    if (!canActivate()) return;

    if (!songMetadataLoaded) {
        console.log("Song metadata not loaded. Please wait before proceeding.");
        return; // Exit the function if metadata isn't loaded
    }

    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    // Increment currentSongIndex and loop back to 0 if it exceeds the array length
    currentSongIndex = (currentSongIndex + 1) % songList.length;

    // Start the game with the next song in the songList array
    startGame(currentSongIndex);

    if (saveSongUsingControllers) {
        saveRecentSong(currentSongPath, getSongTitle(currentSongPath), currentSongIndex + 1, getArtist(currentSongPath)); // Save the recent song
        updateRecentSongButton(); // Update the button text
    }
}

function restartSong() {
    if (!canActivate()) return;

    if (!songMetadataLoaded) {
        console.log("Song metadata not loaded. Please wait before proceeding.");
        return; // Exit the function if metadata isn't loaded
    }

    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    console.log("Restarting song with currentSongIndex: " + currentSongIndex);

    let versionPath = null;
    let indexSet = currentSongIndex;

    for (const [songTitle, versions] of Object.entries(songVersions)) {
        console.log("Checking song title: " + songTitle);
        for (const version of versions) {
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
    if (!canActivate()) return;

    if (!songMetadataLoaded) {
        console.log("Song metadata not loaded. Please wait before proceeding.");
        return; // Exit the function if metadata isn't loaded
    }

    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    console.log("Restarting song: " + currentSongIndex);
    startGame(currentSongIndex);
}

function previousSong() {
    if (!canActivate()) return;

    if (!songMetadataLoaded) {
        console.log("Song metadata not loaded. Please wait before proceeding.");
        return; // Exit the function if metadata isn't loaded
    }

    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;

    startGame(currentSongIndex);

    if (saveSongUsingControllers) {
        saveRecentSong(currentSongPath, getSongTitle(currentSongPath), currentSongIndex + 1, getArtist(currentSongPath)); // Save the recent song
        updateRecentSongButton(); // Update the button text
    }
}

function pickRandomSong() {
    return songList[Math.floor(Math.random() * songList.length)];
}

function pickRandomSongIndex() {
    return Math.floor(Math.random() * songList.length);
}

function randomizeSong() {
    if (!canActivate()) return;

    if (!songMetadataLoaded) {
        console.log("Song metadata not loaded. Please wait before proceeding.");
        return; // Exit the function if metadata isn't loaded
    }

    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    resetSongVariables();

    currentSongIndex = pickRandomSongIndex();

    console.log("Randomizing song to: " + currentSongIndex);

    startGame(currentSongIndex);

    if (saveSongUsingControllers) {
        saveRecentSong(currentSongPath, getSongTitle(currentSongPath), currentSongIndex + 1, getArtist(currentSongPath)); // Save the recent song
        updateRecentSongButton(); // Update the button text
    }
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

    if (speedChanges) {
        ctx.font = "18px Arial";
        ctx.fillText(nextSpeedChange, WIDTH - 10, 300);
    }
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
        24: "Lana Del Rey",
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
        Runaway: "Kanye West, Pusha T",
        "Fire Again": "VALORANT, Ashnikko",
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
        "WAKE UP!": "MoonDeity",
        "Flashing Lights": "Kanye West, Dwele",
        "RUN!": "VALORANT, Odetari, Lay Banks",
        "THE DINER": "Billie Eilish",
        Babooshka: "Kate Bush",
        "Your Girl": "Lana Del Rey",
        "Brand New City": "Mitski",
        "Vivir Mi Vida": "Marc Anthony",
        Idols: "Virtual Riot",
        VVV: "mikeysmind, Sanikwave",
        "aruarian dance": "nujabes",
        "Magic Touch": "Romos",

        // Song Versions

        "Finesse (feat. Cardi B)": "Bruno Mars, Cardi B",
        "WTF 2 - Slowed": "Ugovhb, EF",
        "WTF 2 - Sped Up": "Ugovhb, EF",
        "Slide da Treme Melódica v2 - Slowed": "DJ FNK, Polaris",
        "Slide da Treme Melódica v2 - Ultra Slowed": "DJ FNK, Polaris",
        "Slide da Treme Melódica v2 - Sped Up": "DJ FNK, Polaris",
        "Goosebumps (feat. 21 Savage)": "Travis Scott, Kendrick Lamar, 21 Savage",
        "The Automotivo Infernal 1.0": "MRL, MC GW",
        "The Automotivo Infernal 1.0 - Red": "MRL, MC GW",
        "The Automotivo Infernal 1.0 - Slowed": "MRL, MC GW",
        "The Automotivo Infernal 1.0 - Sped Up": "MRL, MC GW",
        "The Automotivo Infernal 1.0 - Red - Slowed": "MRL, MC GW",
        "The Automotivo Infernal 1.0 - Red - Sped Up": "MRL, MC GW"
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

    setTimeout(preloadSongs, 250);
    preloadImages();

    document.getElementById("undoKeybindsButton").addEventListener("click", undoKeybinds);
    document.getElementById("redoKeybindsButton").addEventListener("click", redoKeybinds);

    // Settings

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
    if (userDevice === "Desktop" || userDevice === "Chromebook") {
        canvas.style.backgroundImage = "url('Resources/BeatzBanner.jpg')";
    } else if (userDevice === "Mobile" || userDevice === "Android" || userDevice === "iOS") {
        canvas.style.backgroundImage = "url('Resources/BeatzBannerMBL.jpg')";
    }

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

    initializeEventListeners();

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

function formatTimestampDS(seconds) {
    if (seconds < 60) {
        // Format as SS.ss for timestamps less than 60 seconds
        const secs = seconds.toFixed(2); // Keep two decimal places
        return `${secs.padStart(5, "0")}`; // Format as SS.ss
    } else {
        // Format as MM:SS.ss for timestamps 60 seconds or more
        const minutes = Math.floor(seconds / 60);
        const secs = (seconds % 60).toFixed(2); // Keep two decimal places
        return `${minutes}:${secs.padStart(5, "0")}`; // Format as MM:SS.ss
    }
}

function removeLowPointSongs() {
    songList.forEach((song) => {
        let title = getSongTitle(song);
        const songData = localStorage.getItem(title);
        if (songData) {
            const songStats = JSON.parse(songData);
            if (songStats.points <= 10) {
                localStorage.removeItem(title);
                logWarn(`Removed "${title}" from localStorage due to insufficient points.`);
            }
        }
    });
}

function startGame(index, versionPath, setIndex) {
    songMetadataLoaded = false; // Reset flag to false at the start of the game

    // Check and remove songs with low points from localStorage
    removeLowPointSongs();

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

    ctx.fillStyle = "white";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Loading song...", WIDTH / 2, HEIGHT / 2 - 60);
    ctx.fillText("This won't take long!", WIDTH / 2, HEIGHT / 2 + 20);

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
        songMetadataLoaded = true; // Set the flag to true when metadata is loaded

        console.log("Loaded selected song's metadata");

        var config = songConfigs[getSongTitle(currentSongPath)] || {
            BPM: 120,
            noteSpeed: 10
        }; // Default values if song is not in the config
        BPM = config.BPM;
        MILLISECONDS_PER_BEAT = 60000 / BPM; // Calculate MILLISECONDS_PER_BEAT based on the BPM
        noteSpeed = config.noteSpeed;

        notes = generateRandomNotes(currentSong.duration * 1000);
        noteYPositions = {
            left: [],
            down: [],
            up: [],
            right: []
        };

        const songTitle = getSongTitle(currentSongPath);
        const songConfig = getDynamicSpeed(currentSongPath);

        if (songConfig) {
            console.log(`Dynamic speed configuration found for "${songTitle}"`);
            dynamicSpeedInfo = songConfig.map((config) => `Timestamp: ${config.timestamp}, Speed: ${config.noteSpeed}`).join(" | ");
            currentConfigIndex = 0; // Reset currentConfigIndex
            nextSpeedChange = ""; // Reset nextSpeedChange
            speedChanges = true;

            speedUpdater = setInterval(() => {
                if (currentSong && songConfig && currentConfigIndex < songConfig.length) {
                    const currentTime = currentSong.currentTime;
                    const nextConfig = songConfig[currentConfigIndex];
                    if (currentTime >= nextConfig.timestamp) {
                        noteSpeed = nextConfig.noteSpeed;
                        console.log(`Updated note speed to: ${noteSpeed} at timestamp: ${formatTimestampDS(nextConfig.timestamp)}`);
                        if (nextConfig.BPM) {
                            BPM = nextConfig.BPM;
                            MILLISECONDS_PER_BEAT = 60000 / BPM;
                            console.log(`Updated BPM to: ${BPM} at timestamp: ${nextConfig.timestamp}`);
                        }
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
                        if (nextConfig.useNotes) {
                            notes = nextConfig.savedNotes;
                            console.log(`Updated current notes at timestamp: ${nextConfig.timestamp}`);
                        }
                        currentConfigIndex++;
                    }
                    // Update next imminent speed change with more detail
                    if (currentConfigIndex < songConfig.length) {
                        let details = [];
                        if (nextConfig.noteSpeed) {
                            details.push(`Speed: ${nextConfig.noteSpeed}`);
                        }
                        if (nextConfig.BPM) {
                            details.push(`BPM: ${nextConfig.BPM}`);
                        }
                        if (nextConfig.notes) {
                            details.push("Notes ending...");
                        }
                        if (nextConfig.endScreenDrawn) {
                            nextSpeedChange = "No more speed changes."; // Treat this as the final change
                        } else {
                            nextSpeedChange = `Next change at: ${formatTimestampDS(nextConfig.timestamp)}, ${details.join(", ")}`;
                        }
                    } else {
                        nextSpeedChange = "No more speed changes.";
                        setTimeout(() => {
                            nextSpeedChange = "";
                        }, 5000);
                    }
                } else {
                    clearInterval(speedUpdater);
                }
            }, 1); // Check for a speed update every millisecond, for accuracy
        } else {
            console.log(`No dynamic speed configuration for "${songTitle}"`);
            dynamicSpeedInfo = "No dynamic speed configuration found.";
            nextSpeedChange = "No speed changes.";
            speedChanges = false;
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
        if (userDevice === "Mobile" || userDevice === "iOS" || userDevice === "Android") {
            document.getElementById("togglePauseMBL").style.display = "inline";
        }

        document.getElementById("startButton").style.display = "none";

        // Update the page title
        indexToDisplay = setIndex >= 0 ? setIndex : currentSongIndex;
        document.title = `Song ${indexToDisplay + 1}: ${getSongTitle(currentSongPath)} | Beatz Testing 4.2!`;

        console.log(`indexToDisplay converted in startGame: ${indexToDisplay}`);
    };
}

function songEnd() {
    endScreenDrawn = true;
}

// Score logic

// Function to save the score to localStorage
function saveScore(song, points, perfects, misses, earlylates, maxstreak) {
    console.log("Saving:", song, points, perfects, misses, earlylates, maxstreak);

    if (autoHitDisableSaving) {
        logNotice(`Score for ${song} not saved because Auto Hit was enabled during gameplay. Don't cheat!`, "rgb(190, 50, 0)");
        return;
    } else if (maxstreak === 0) {
        logNotice(`You went AFK for the whole song. Score has not been saved.`);
        return;
    } else if (points <= 10) {
        logNotice(`At least 10 points needed to save score. Points: ${points}.`);
        return;
    }

    const score = {
        points: points,
        perfects: perfects,
        misses: misses,
        earlylates: earlylates,
        maxstreak: maxstreak
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
                logNotice(`New best score for ${song} with ${points} points. Amazing!`);
            } else {
                logNotice(`Score for ${song} is not higher than existing best score, score has not been saved.`);
            }
        } else if (!existingScoreStr) {
            // If no existing score, save the new score
            localStorage.setItem(song, JSON.stringify(score));
            logNotice(`Score for ${song} saved to localStorage as your first new best score with ${points} points. Nice!`);
        }
    } catch (error) {
        console.error(`Error saving score for ${song} to localStorage:`, error);
        logError(`Error saving best score. ${error} | ${error.message}`);
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
        logError(`Error calling saveScore(). ${error} | ${error.message}`);
    }

    if (restartSongTimeout) {
        console.log("Restarting song in ", songTimeoutDelay / 1000, " seconds...");
        setTimeout(() => {
            restartSong();
        }, songTimeoutDelay); // Delay specified in settings
    }

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

    noteYPositions.left = [];
    noteYPositions.up = [];
    noteYPositions.down = [];
    noteYPositions.right = [];

    console.log(noteYPositions.left);
    console.log(noteYPositions.down);
    console.log(noteYPositions.up);
    console.log(noteYPositions.right);

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

console.log("Saving logic loaded.");

console.log("Ready to start Beatz.");

// Function to toggle debug info visibility
function toggleDebugInfo() {
    debugInfoVisible = !debugInfoVisible;
}

function updateDebugInfo(deltaTime, timestamp) {
    if (debugInfoVisible) {
        var lineHeight = 18;
        const startY = HEIGHT / 2 - 180; // Starting y-coordinate for the first text
        const left = parseFloat(noteYPositions.left);
        const up = parseFloat(noteYPositions.up);
        const down = parseFloat(noteYPositions.down);
        const right = parseFloat(noteYPositions.right);

        if (userDevice === "Mobile" || userDevice === "Android" || userDevice === "iOS") {
            ctx.font = "16px Arial";
            lineHeight = 20;
        } else {
            ctx.font = "11px Arial";
        }
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText(`Version: ${VERSION}`, 10, startY);
        ctx.fillText(`Device: ${userDevice}`, 10, startY + lineHeight);
        ctx.fillText(`Delta Time: ${deltaTime.toFixed(3)} seconds`, 10, startY + 2 * lineHeight);
        ctx.fillText(`Timestamp: ${timestamp} milliseconds`, 10, startY + 3 * lineHeight);
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
        ctx.fillText(`Dynamic Speed index: ${currentConfigIndex}`, 10, startY + 19 * lineHeight);
        ctx.fillText(`Milliseconds Per Beat (Calculated by BPM): ${MILLISECONDS_PER_BEAT}`, 10, startY + 20 * lineHeight);
        ctx.fillText(`Saved notes: ${savedNotes}`, 10, startY + 21 * lineHeight);
        ctx.fillText(`Index to Display: ${indexToDisplay + 1}`, 10, startY + 22 * lineHeight);
        ctx.fillText(`FPS buffed hit ranges? ${fpsBuffedHitRanges}`, 10, startY + 23 * lineHeight);
        ctx.fillText(`Error array: ${errorArray}`, 10, startY + 24 * lineHeight);
        ctx.fillText(`Notice array: ${noticeArray}`, 10, startY + 25 * lineHeight);

        ctx.font = "14px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`Control + Shift + H`, WIDTH - 10, startY + 10 * lineHeight);
        ctx.fillText(`To open Hitbox View`, WIDTH - 10, startY + 11 * lineHeight);
    }
}

let isFlashing = false; // To track the flashing state
const FLASH_DURATION = 100; // Duration of the flash in milliseconds

// Function to toggle flashing
function toggleFlash() {
    isFlashing = true;
    setTimeout(() => {
        isFlashing = false;
    }, FLASH_DURATION);
}

// Set interval to trigger the flashing based on MILLISECONDS_PER_BEAT
setInterval(toggleFlash, MILLISECONDS_PER_BEAT * 512);

const buttonAreas = {
    left: { x: 0, y: 0, width: WIDTH / 4, height: HEIGHT },
    up: { x: WIDTH / 4, y: 0, width: WIDTH / 4, height: HEIGHT },
    down: { x: WIDTH / 2, y: 0, width: WIDTH / 4, height: HEIGHT },
    right: { x: 960, y: 0, width: WIDTH / 4, height: HEIGHT }
};

function resizeCanvas() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const canvasAspectRatio = canvas.width / canvas.height;
    const viewportAspectRatio = viewportWidth / viewportHeight;

    let scaleFactor;
    let canvasWidth, canvasHeight;

    if (viewportAspectRatio > canvasAspectRatio) {
        // Fit canvas height to viewport height
        scaleFactor = viewportHeight / canvas.height;
        canvasWidth = canvas.width * scaleFactor;
        canvasHeight = viewportHeight;
    } else {
        // Fit canvas width to viewport width
        scaleFactor = viewportWidth / canvas.width;
        //canvasWidth = canvas.width * scaleFactor;
        //canvasHeight = viewportHeight;
        canvasWidth = viewportWidth;
        canvasHeight = canvas.height * scaleFactor;
    }

    // Apply scaling transformation
    canvas.style.transform = `scale(${scaleFactor * 1.45})`;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.scaleFactor = scaleFactor; // Store the scale factor for use in touch/mouse handling
}

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        // Portrait mode
        canvas.style.display = "none";
        document.getElementById("orientationMessage").style.display = "block";
    } else {
        // Landscape mode
        canvas.style.display = "block";
        document.getElementById("orientationMessage").style.display = "none";
    }
}

function calculateFPS(deltaTime) {
    // Calculate FPS
    let currentFPS = 1 / deltaTime;
    FPS = currentFPS.toFixed(1);

    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Current FPS: ${FPS}`, WIDTH / 2, HEIGHT - 30);
}

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

    if (document.fullscreenElement) {
        canvas.style.cursor = "none";
        if (!backgroundIsDefault && document.fullscreenElement) {
            canvas.style.background = "url('Resources/BackgroundHtml2.png')";
            canvas.style.backgroundSize = "cover";
            canvas.style.backgroundPosition = "center";
        }
    } else if (!backgroundIsDefault && !document.fullscreenElement) {
        canvas.style.background = "transparent"; // If the background is transparent, when fullscreen is toggled off, make the canvas transparent again
    } else if (backgroundIsDefault && !document.fullscreenElement) {
        canvas.style.background = BGurl;
        canvas.style.backgroundSize = "cover";
        canvas.style.backgroundPosition = "center";
    } else if (backgroundIsDefault && document.fullscreenElement) {
        canvas.style.background = BGurl;
        canvas.style.backgroundSize = "cover";
        canvas.style.backgroundPosition = "center";
    }

    if (!songMetadataLoaded) {
        ctx.fillStyle = "white";
        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Loading song...", WIDTH / 2, HEIGHT / 2 - 60);
        ctx.fillText("This won't take long!", WIDTH / 2, HEIGHT / 2 + 20);
    }

    ctx.drawImage(noteLeftIMG, noteXPositions.left - noteWidth / 2, 550, noteWidth, noteHeight);
    ctx.drawImage(noteUpIMG, noteXPositions.up - noteWidth / 2 + 15, 550, noteWidth, noteHeight);
    ctx.drawImage(noteDownIMG, noteXPositions.down - noteWidth / 2 - 15, 550, noteWidth, noteHeight);
    ctx.drawImage(noteRightIMG, noteXPositions.right - noteWidth / 2, 550, noteWidth, noteHeight);

    let fontTuto = isMobile ? "26px Arial" : "22px Arial";

    if (isNewPlayer) {
        switch (tutorialStage) {
            case 0:
                ctx.textAlign = "center";
                ctx.font = fontTuto;
                if (isMobile) {
                    ctx.fillText(tutorialMobile.initial.tap, WIDTH / 2, 490);

                    ctx.font = "22px Arial";
                    ctx.fillText(tutorialMobile.initial.left, noteXPositions.left, 540);
                    ctx.fillText(tutorialMobile.initial.up, noteXPositions.up + 16, 540);
                    ctx.fillText(tutorialMobile.initial.down, noteXPositions.down - 16, 540);
                    ctx.fillText(tutorialMobile.initial.right, noteXPositions.right, 540);

                    ctx.font = fontTuto;
                    ctx.fillText(tutorialMobile.initial.ofScreen, WIDTH / 2, 650);
                } else {
                    ctx.fillText(tutorialDesktop.initial.left, noteXPositions.left, 540);
                    ctx.fillText(tutorialDesktop.initial.up, noteXPositions.up + 16, 540);
                    ctx.fillText(tutorialDesktop.initial.down, noteXPositions.down - 16, 540);
                    ctx.fillText(tutorialDesktop.initial.right, noteXPositions.right, 540);
                }
                break;
            case 1:
                ctx.textAlign = "center";
                ctx.font = fontTuto;
                ctx.fillText(tutorialDesktop.customizable, WIDTH / 2, 510);
                break;
            case 2:
                // If mobile, skip to case 5
                if (isMobile) {
                    tutorialStage = 5;
                    break;
                }
                ctx.textAlign = "center";
                ctx.font = fontTuto;
                ctx.fillText(tutorialDesktop.followMe.announce, WIDTH / 2, 510);
                break;
            case 3:
                ctx.textAlign = "center";
                ctx.font = fontTuto;
                ctx.fillText(tutorialDesktop.followMe.twitter, WIDTH / 2, 510);
                break;
            case 4:
                ctx.textAlign = "center";
                ctx.font = fontTuto;
                ctx.fillText(tutorialDesktop.followMe.yt, WIDTH / 2, 510);
                break;
            case 5:
                ctx.textAlign = "center";
                ctx.font = fontTuto;
                ctx.fillText(tutorialDesktop.thankYou, WIDTH / 2, 510);
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

        calculateFPS(timeDelta);

        if (isMobile) {
            drawTapBoxes();
        }

        if (FPS <= 32) {
            PERFECT_HIT_RANGE_MIN = 534;
            PERFECT_HIT_RANGE_MAX = 576;
            HIT_Y_RANGE_MIN = 485;
            HIT_Y_RANGE_MAX = 615;
            MISS_RANGE = 650;
            fpsBuffedHitRanges = true;
            // console.warn(`EXTREMELY Low FPS! Hit ranges have been buffed greatly. FPS: ${FPS}`);
        }

        if (FPS > 32 && FPS <= 61) {
            PERFECT_HIT_RANGE_MIN = 538;
            PERFECT_HIT_RANGE_MAX = 572;
            HIT_Y_RANGE_MIN = 495;
            HIT_Y_RANGE_MAX = 610;
            MISS_RANGE = 690;
            fpsBuffedHitRanges = true;
            // console.warn(`Low FPS! Hit ranges have been buffed. FPS: ${FPS}`);
        }

        if (FPS > 62 && FPS <= 122) {
            PERFECT_HIT_RANGE_MIN = 542;
            PERFECT_HIT_RANGE_MAX = 568;
            HIT_Y_RANGE_MIN = 500;
            HIT_Y_RANGE_MAX = 600;
            MISS_RANGE = 700;
            fpsBuffedHitRanges = false;
        }

        if (FPS > 123 && FPS <= 167) {
            PERFECT_HIT_RANGE_MIN = 542;
            PERFECT_HIT_RANGE_MAX = 568;
            HIT_Y_RANGE_MIN = 500;
            HIT_Y_RANGE_MAX = 600;
            MISS_RANGE = 712;
            fpsBuffedHitRanges = false;
        }

        if (FPS > 168 && FPS <= 242) {
            PERFECT_HIT_RANGE_MIN = 542;
            PERFECT_HIT_RANGE_MAX = 568;
            HIT_Y_RANGE_MIN = 500;
            HIT_Y_RANGE_MAX = 600;
            MISS_RANGE = 715;
            fpsBuffedHitRanges = false;
        }

        // Calculate progress based on the current song time and duration
        const currentSongTime = currentSong.currentTime;
        const duration = currentSong.duration;
        const progressWidth = (WIDTH * currentSongTime) / duration;

        // Determine the color of the progress bar based on the flash state
        ctx.fillStyle = isFlashing ? "white" : "red"; // Flash color or normal color

        // Draw the progress bar at the top of the canvas
        ctx.fillRect(0, 0, progressWidth, 5); // Change 5 to the height of your progress bar

        // Display current time and duration below the progress bar
        ctx.fillStyle = "#FFFFFF"; // Color of the text
        ctx.font = "18px Arial"; // Font style and size for the text
        ctx.textAlign = "center";

        // Format the current time and duration as mm:ss
        const formattedCurrentTime = formatTimeWithDecimal(currentSongTime);
        const formattedDuration = formatTime(duration);

        // Draw the current time and duration on the canvas
        ctx.fillText(`${formattedCurrentTime} / ${formattedDuration}`, WIDTH / 2, 30); // Change 10, 20 to position the text

        // Display "Auto Hit: On" text if auto-hit is enabled
        if (autoHitEnabled) {
            drawAutoHitText();
        }

        if (!canvasUpdating) {
            return;
        }
    }
    requestAnimationFrame((timestamp) => updateCanvas(timestamp, setIndex));
}

const activeTouches = new Map(); // To track active touch points

function isWithinBounds(x, y, area) {
    return x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height;
}

function handleTouchOrMouse(event) {
    if (!isMobile) return; // Ignore if not in mobile mode

    const rect = canvas.getBoundingClientRect();
    const scaleFactor = canvas.scaleFactor;

    let touches;
    if (event.touches) {
        touches = event.touches; // Handle multiple touch points
    } else {
        touches = [event]; // Handle single mouse event
    }

    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const x = (touch.clientX - rect.left) / scaleFactor;
        const y = (touch.clientY - rect.top) / scaleFactor;

        console.log(`Tap/Click Coordinates: x=${x}, y=${y}`);

        const isLeftPressed = isWithinBounds(x, y, buttonAreas.left);
        const isUpPressed = isWithinBounds(x, y, buttonAreas.up);
        const isDownPressed = isWithinBounds(x, y, buttonAreas.down);
        const isRightPressed = isWithinBounds(x, y, buttonAreas.right);

        if (event.touches) {
            activeTouches.set(touch.identifier, { isLeftPressed, isUpPressed, isDownPressed, isRightPressed });
        } else {
            leftPressed = isLeftPressed;
            upPressed = isUpPressed;
            downPressed = isDownPressed;
            rightPressed = isRightPressed;
        }
    }

    updateGlobalState();
}

function handleTouchStart(e) {
    handleTouchOrMouse(e);
}

function handleTouchEnd(e) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        activeTouches.delete(touch.identifier);
    }
    updateGlobalState();
}

function handleMouseDown(e) {
    handleTouchOrMouse(e);
}

function handleMouseUp(e) {
    leftPressed = false;
    upPressed = false;
    downPressed = false;
    rightPressed = false;
}

// Update the global state
function updateGlobalState() {
    // Check if any active touch or mouse events are set
    leftPressed = Array.from(activeTouches.values()).some((state) => state.isLeftPressed);
    upPressed = Array.from(activeTouches.values()).some((state) => state.isUpPressed);
    downPressed = Array.from(activeTouches.values()).some((state) => state.isDownPressed);
    rightPressed = Array.from(activeTouches.values()).some((state) => state.isRightPressed);
}

function drawTapBoxes() {
    // Draw button areas
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    // Left button area
    ctx.strokeRect(buttonAreas.left.x, buttonAreas.left.y, buttonAreas.left.width, buttonAreas.left.height);

    // Up button area
    ctx.strokeStyle = "green";
    ctx.strokeRect(buttonAreas.up.x, buttonAreas.up.y, buttonAreas.up.width, buttonAreas.up.height);

    // Down button area
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(buttonAreas.down.x, buttonAreas.down.y, buttonAreas.down.width, buttonAreas.down.height);

    // Right button area
    ctx.strokeStyle = "rgb(0, 204, 255)";
    ctx.strokeRect(buttonAreas.right.x, buttonAreas.right.y, buttonAreas.right.width, buttonAreas.right.height);
}

function formatTimeWithDecimal(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const fractionalSeconds = (seconds % 1).toFixed(2).substring(2); // Get two decimal places for fractional seconds
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}.${fractionalSeconds}`; // Formats time as mm:ss.xx
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`; // Formats time as mm:ss
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
    // Hit notes perfectly, disables point saving after a song ends
    for (let type in noteYPositions) {
        for (let i = 0; i < noteYPositions[type].length; i++) {
            let yPos = noteYPositions[type][i];
            if (yPos >= PERFECT_HIT_RANGE_MIN) {
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

            notesHit++;
            if (notesHit === 4) {
                tutorialStage = 1;
                textY = 670;
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
            localStorage.setItem("newPlayer", "false");
        }, 5000);
    }
}

function toggleHitboxes() {
    showHitboxes = !showHitboxes;
    logNotice(`Hitboxes ${showHitboxes ? "enabled" : "disabled"}`, "rgb(0, 50, 0)", 2000);
}

function toggleCanvasRefresh() {
    if (canvasUpdating) {
        canvasUpdating = false;
        logNotice("Canvas stopped updating.", "rgb(0, 50, 0)");
    } else if (!canvasUpdating) {
        canvasUpdating = true;
        logNotice("Resuming canvas refresh.", "rgb(0, 75, 0)");
        requestAnimationFrame(updateCanvas);
    }
}

function drawHitboxes() {
    if (showHitboxes) {
        // Draw green hitboxes for stationary notes
        ctx.strokeStyle = "green";
        ctx.strokeRect(noteXPositions.left - noteWidth / 2, HIT_Y_RANGE_MIN + 50, noteWidth, (HIT_Y_RANGE_MAX - HIT_Y_RANGE_MIN) / 2);
        ctx.strokeRect(noteXPositions.up - noteWidth / 2 + 15, HIT_Y_RANGE_MIN + 50, noteWidth, (HIT_Y_RANGE_MAX - HIT_Y_RANGE_MIN) / 2);
        ctx.strokeRect(noteXPositions.down - noteWidth / 2 - 15, HIT_Y_RANGE_MIN + 50, noteWidth, (HIT_Y_RANGE_MAX - HIT_Y_RANGE_MIN) / 2);
        ctx.strokeRect(noteXPositions.right - noteWidth / 2, HIT_Y_RANGE_MIN + 50, noteWidth, (HIT_Y_RANGE_MAX - HIT_Y_RANGE_MIN) / 2);

        // Draw red rectangles for the perfect hit range
        ctx.strokeStyle = "red";
        ctx.strokeRect(noteXPositions.left - noteWidth / 2, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);
        ctx.strokeRect(noteXPositions.up - noteWidth / 2 + 15, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);
        ctx.strokeRect(noteXPositions.down - noteWidth / 2 - 15, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);
        ctx.strokeRect(noteXPositions.right - noteWidth / 2, PERFECT_HIT_RANGE_MIN + 20, noteWidth, PERFECT_HIT_RANGE_MAX - PERFECT_HIT_RANGE_MIN);

        // Draw a dark blue line at the first miss range and a bright blue line at the second miss range
        ctx.strokeStyle = "blue";
        ctx.strokeRect(WIDTH / 2 - 150, MISS_RANGE, 300, 2);
        ctx.strokeStyle = "cyan";
        ctx.strokeRect(WIDTH / 2 - 150, MISS_RANGE + noteHeight, 300, 2);
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
            if (yPos > MISS_RANGE) {
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

// Get the modal and buttons
const customSongModal = document.getElementById("customSongModal");
const openCustomSongModal = document.getElementById("openCustomSongModal");
const closeCustomSong = document.getElementById("closeCustomSongModal");
const createButton = document.getElementById("createCustomSong");

// Open the modal
openCustomSongModal.onclick = function () {
    customSongModal.style.display = "block";
    deactivateKeybinds();
};

// Close the modal
closeCustomSong.onclick = function () {
    customSongModal.style.display = "none";
    activateKeybinds();
};

// Close the modal when clicking outside of it
window.onclick = function (event) {
    if (event.target === customSongModal) {
        customSongModal.style.display = "none";
    }
};

// Handle file input and note generation
createButton.onclick = function () {
    const fileInput = document.getElementById("songFile");
    const titleInput = document.getElementById("customSongTitle").value;
    const noteSpeed = parseInt(document.getElementById("noteSpeed").value);
    const bpm = parseInt(document.getElementById("bpm").value);

    if (fileInput.files.length === 0) {
        alert("Please upload an MP3 file.");
        return;
    }

    const file = fileInput.files[0];
    if (file.type !== "audio/mp3") {
        alert("Please upload a valid MP3 file.");
        return;
    }

    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = function () {
        const duration = audio.duration * 1000; // Convert duration to milliseconds

        // Generate notes
        const notes = generateRandomNotes(duration);

        // Apply note speed and BPM
        applyNoteSpeedAndBPM(noteSpeed, bpm);

        // Start the game with the custom song
        startCustomGame(file, titleInput, notes);
    };
};

// Function to apply note speed and BPM
function applyNoteSpeedAndBPM(noteSpeed, bpm) {
    // Implement your logic to apply note speed and BPM
    console.log("Note Speed:", noteSpeed, "BPM:", bpm);
}

// Function to start the game with the custom song
function startCustomGame(file, title, notes) {
    // Implement your logic to start the game with the given song and notes
    console.log("Starting custom game with title:", title);
    console.log("Notes:", notes);
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
