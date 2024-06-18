/**
 * Title: Beatz
 * Author: Victor//GuayabR
 * Date: 16/05/2024
 * Version: 2.3
 **/

// CONSTANTS

const VERSION = "2.3 (GitHub Port)";
console.log("Version: "+ VERSION)

const WIDTH = 1280;
const HEIGHT = 720;

const noteWidth = 50;
const noteHeight = 50;

const HIT_Y_RANGE_MIN = 500;
const HIT_Y_RANGE_MAX = 600;

const MIN_NOTE_GAP = 775; // Minimum gap between notes in milliseconds

const MAX_HIT_SOUNDS = 5;

const textY = 670;

const noteXPositions = {
    left: WIDTH / 2 - 110,
    down: WIDTH / 2 + 53,
    up: WIDTH / 2 - 53,
    right: WIDTH / 2 + 110,
};

console.log("Constants loaded.")

// VARIABLES
var ctx;

var timer; // Declare timer in the global scope to keep track of the interval ID

var gameStarted = false;

let currentSong;
let songStarted = false;
let songStartTime;
let songPausedTime;

let currentSongPath;

let songList = [];
let songLoadCounter = 0;

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
        "Resources/Songs/testingsong.mp3",
    ];

    let currentIndex = 0;
    const totalSongs = songPaths.length;

    // Add counter text beside the header
    const counterText = document.createElement('span');
    counterText.textContent = ` (${songLoadCounter}/${totalSongs} songs loaded)`;
    const headerElement = document.querySelector('h1');
    headerElement.appendChild(counterText);

    function loadNextSong() {
        if (currentIndex < totalSongs) {
            const songPath = songPaths[currentIndex];
            const songTitle = getSongTitle(songPath);
            const audio = new Audio();
            audio.src = songPath;
            audio.oncanplaythrough = function() {
                songList.push(songPath);
                console.log("Loaded song:", songTitle);
                songLoadCounter++; // Increment songLoadCounter when a song is successfully loaded
                currentIndex++;
                counterText.textContent = ` (${songLoadCounter}/${totalSongs} songs loaded)`; // Update the counter text
                loadNextSong(); // Load the next song recursively
                checkAllSongsLoaded(totalSongs); // Check if all songs are loaded
            };
            audio.onerror = function() {
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
        if (songLoadCounter === totalSongs) {
            populateSongSelector();
            const startButton = document.getElementById('startButton');
            startButton.style.display = 'inline';
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
    "Resources/Songs/Shiawase (VIP).mp3": { BPM: 150, noteSpeed: 11.55 },
    "Resources/Songs/Sleepwalker X Icewhxre.mp3": { BPM: 120, noteSpeed: 10 },
    "Resources/Songs/Stressed Out.mp3": { BPM: 170, noteSpeed: 8 },
    "Resources/Songs/Ticking Away.mp3": { BPM: 95, noteSpeed: 10 },
    "Resources/Songs/VISIONS.mp3": { BPM: 157, noteSpeed: 8 },
    "Resources/Songs/VVV.mp3": { BPM: 131, noteSpeed: 10 },
    "Resources/Songs/WTF 2.mp3": { BPM: 93, noteSpeed: 10 },
    "Resources/Songs/MY EYES.mp3": { BPM: 132, noteSpeed: 12 },
    "Resources/Songs/Can't Slow Me Down.mp3": { BPM: 122, noteSpeed: 11 },
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
    "Resources/Songs/I Wonder.mp3": { BPM: 191, noteSpeed: 8 },
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
};

console.log("Song Configurations loaded.");

// Loaded images dictionary
const loadedImages = {};

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
    ];

    for (const coverPath of albumCovers) {
        const songTitle = getSongTitle(coverPath);
        const coverImage = new Image();
        coverImage.src = coverPath;
        coverImage.onload = function() {
            loadedImages[songTitle] = coverImage;
            console.log("Loaded cover image for song:", songTitle);
        };
        coverImage.onerror = function() {
            console.log("Failed to load cover image for song:", songTitle);
        };
    }
}

// Function to populate song selector
function populateSongSelector() {
    const songSelector = document.getElementById('songSelector');
    songSelector.innerHTML = ''; // Clear loading message

    // Add default "Select song" option
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.text = "Select song.";
    songSelector.appendChild(defaultOption);

    let songsLoadedCounter = 0; // Counter for loaded songs

    songList.forEach((songPath, index) => {
        const option = document.createElement('option');
        option.value = index; // Assign the index as the option value
        option.text = getSongTitle(songPath);
        songSelector.appendChild(option);
        songsLoadedCounter++; // Increment the counter for each loaded song
    });

    songSelector.addEventListener('change', function() {
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


let currentSongVolume = localStorage.getItem('songVolume') ? parseFloat(localStorage.getItem('songVolume')) : 0.5; // Load volume or default to 50%

// Event listeners for volume sliders
document.getElementById('songVolume').addEventListener('input', function() {
    currentSongVolume = this.value / 100; // Convert to range 0-1
    localStorage.setItem('songVolume', currentSongVolume); // Save to localStorage
    adjustSongVolume(currentSongVolume);
});

// Function to adjust song volume
function adjustSongVolume(volume) {
    if (currentSong) {
        currentSong.volume = volume;
    }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    const songSelector = document.getElementById('songSelector');
    const loadingOption = document.createElement('option');
    loadingOption.value = "";
    loadingOption.text = "Loading songs...";
    songSelector.appendChild(loadingOption);

    const songVolumeSlider = document.getElementById('songVolume');
    songVolumeSlider.value = currentSongVolume * 100;
    console.log("Loaded saved song volume")

    preloadSongs();
    preloadImages();
});

var hitSounds = [];

for (let i = 0; i < MAX_HIT_SOUNDS; i++) {
    let hitSound = new Audio("Resources/SFX/hitSound.mp3");
    hitSound.volume = 0.05;
    hitSounds.push(hitSound);
}

// Song controllers

let currentSongIndex = 0; // Keep track of the index of the current song

function nextSong() {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    // Reset variables
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
    if (timer) {
        clearInterval(timer);
    }

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

    if (timer) {
        clearInterval(timer);
    }
    
    console.log("Restarting song from index: " + currentSongIndex);
    startGame(currentSongIndex);
}

function previousSong() {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    // Reset variables
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
    if (timer) {
        clearInterval(timer);
    }

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

    // Reset variables
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
    if (timer) {
        clearInterval(timer);
    }

    // Randomize song
    currentSongIndex = pickRandomSongIndex();
    console.log("Randomizing song to: " + currentSongIndex);

    // Start the game with the new random song
    startGame(currentSongIndex);
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
    let fileName = songPath.split('/').pop();
    // Remove the file extension
    fileName = fileName.replace('.mp3', '').replace('.jpg', '').replace("_", "'");
    // Decode the URI component
    let decodedTitle = decodeURIComponent(fileName);
    return decodedTitle;
}

function getArtist(songSrc) {
    // Define the artist for each song
    const artists = {
    "Epilogue": "Creo",
    "Exosphere": "Creo",
    "Die For You": "VALORANT",
    "Father Stretch My Hands": "Kanye West",
    "Betty (Get Money)": "Yung Gravy",
    "BURN IT DOWN": "Linkin Park",
    "Aleph 0": "LeaF",
    "Better Days": "LAKEY INSPIRED",
    "KOCMOC": "SLEEPING HUMMINGBIRD",
    "kompa pasion": "frozy",
    "Legends Never Die": "League Of Legends",
    "Star Walkin": "League Of Legends",
    "What I've Done": "Linkin Park",
    "Biggest NCS Songs": "NoCopyrightSounds",
    "Goosebumps": "Travis Scott",
    "Master Of Puppets (Live)": "Metallica",
    "Numb": "Linkin Park",
    "sdp interlude": "Travis Scott",
    "Shiawase (VIP)": "Dion Timmer",
    "VVV": "mikeysmind",
    "Sleepwalker X Icewhxre": "akiaura X Lumi Athena",
    "WTF 2": "Ugovhb",
    "VISIONS": "VALORANT",
    "Stressed Out": "twenty one pilots",
    "Ticking Away": "VALORANT",
    "MY EYES": "Travis Scott",
    "Can't Slow Me Down": "VALORANT",
	"Butterfly Effect": "Travis Scott",
	"SWIM": "Chase Atlantic",
    "You Need Jesus": "BABY GRAVY",
    "Crazy": "Creo",
    "FE!N": "Travis Scott",
    "Nautilus": "Creo",
    "Levitating": "Dua Lipa",
    "Somewhere I Belong": "Linkin Park",
    "From The Inside": "Linkin Park",
    "Faint": "Linkin Park",
    "Breaking The Habit": "Linkin Park",
    "I Wonder": "Kanye West",
    "Godzilla": "Eminem",
    "Houdini": "Eminem",
    "Runaway": "Kanye West",
    "Rush E": "M.J. Kelly",
    "Vamp Anthem": "Playboi Carti",
    "CARNIVAL": "Kanye West",
    "HUMBLE.": "Kendrick Lamar",
    "Stop Breathing": "Playboi Carti",
    "CHEGOU 3": "shonci",
    "KRUSH ALERT": "shonci",
        // Add artist for other songs here
    };
    let songTitle = getSongTitle(songSrc);
    return artists[songTitle] || "N/A";
}

// Function to get the album cover image based on the song path
function getCover(songPath) {
    const songTitle = getSongTitle(songPath);
    const coverImage = loadedImages[songTitle];
    if (coverImage) {
        ctx.drawImage(coverImage, WIDTH - 190, 92, 180, 180);
    } else {
        ctx.drawImage(noCover, WIDTH - 190, 92, 180, 180);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "right";
        ctx.fillText("No cover found", WIDTH - 10, 294);
        ctx.fillText("for " + getSongTitle(currentSong.src), WIDTH - 10, 318);
    }
}

var autoHitEnabled = false;

// Generate random notes for 4 minutes
var notes = generateRandomNotes(696969);

var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;

// Define image objects for each note type
var noteImages = {
    'Left': noteLeftIMG,
    'Down': noteDownIMG,
    'Up': noteUpIMG,
    'Right': noteRightIMG
};

// Define pressed image objects for each note type
var notePressImages = {
    'Left': noteLeftPressIMG,
    'Down': noteDownPressIMG,
    'Up': noteUpPressIMG,
    'Right': noteRightPressIMG
};

var noteSpeed = 10;
var BPM = 200;
var MILLISECONDS_PER_BEAT;

var points = 0;
var totalMisses = 0;
var perfectHits = 0;
var earlyLateHits = 0;

let currentStreak = 0;
let maxStreak = 0;

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

console.log("Variables loaded.")

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

// Function to switch image source
function switchImage(img, src1, src2) {
    if (img.src.endsWith(src1)) {
        img.src = 'Resources/' + src2;
    } else {
        img.src = 'Resources/' + src1;
    }
}

document.getElementById('toggleNoteStyleButton').addEventListener('click', function() {
    toggleNoteStyle();
});

// Ensure images are loaded before drawing
window.onload = function() {
    var images = [
        noteLeftIMG, noteDownIMG, noteUpIMG, noteRightIMG,
        noteLeftPressIMG, noteDownPressIMG, noteUpPressIMG, noteRightPressIMG
    ];
    
    var loadedImages = 0;
    images.forEach(function(image) {
        image.onload = function() {
            loadedImages++;
            if (loadedImages === images.length) {
                draw();
            }
        };
    });
};

// BGs
var BGbright = new Image();
BGbright.src = "Resources/Background2.png";

console.log("Textures loaded.")

// Note positions
var noteYPositions = {
    left: [],
    down: [],
    up: [],
    right: []
};

// Function to simulate key press
function simulateKeyPress(key) {
    // Create a new KeyboardEvent with the specified key
    var event = new KeyboardEvent('keydown', { key: key });

    // Dispatch the event to simulate the key press
    document.dispatchEvent(event);
}

// Add event listener for click event on the target element
//window.addEventListener('click', MouseClick);

// Event handler for click event
//function MouseClick(event) {
//}

// Usage:
//const canvas = document.getElementById('myCanvas');
//makeCanvasFullscreen(canvas);

window.onload = function () {
    ctx = document.getElementById("myCanvas").getContext("2d");
    document.getElementById("toggleAutoHit").addEventListener("click", toggleAutoHit);
    document.getElementById("nextButton").addEventListener("click", nextSong);
    document.getElementById("restartButton").addEventListener("click", restartSong);
    document.getElementById("previousButton").addEventListener("click", previousSong);
    document.getElementById("randomizeButton").addEventListener("click", randomizeSong);

    document.getElementById('startButton').onclick = function() {
        startGame();
    };

    // Disable the button if it's clicked once
    var startButton = document.getElementById("startButton");
    startButton.addEventListener("click", function() {
        document.getElementById("startButton").style.display = "none";
    });
};

console.log("Window.onload loaded.")

function togglePause() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        songPausedTime = Date.now();
        currentSong.pause();
        console.log("Game Paused");
    } else {
        let pauseDuration = Date.now() - songPausedTime;
        songStartTime += pauseDuration;
        currentSong.play();
        console.log("Game Unpaused");
    }
}

function gameLoop() {
    updateCanvas();
    if (!gamePaused) {
        requestAnimationFrame(gameLoop);
    }
}

// Start the game loop
//gameLoop();

function startGame(index) {
    console.log("Starting game with index:", index);

    // Reset autoHitDisableSaving and autoHit when starting a new game
    autoHitDisableSaving = false;
    autoHitEnabled = false;

    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0; // Reset the song to the beginning
    }

    if (typeof index === 'undefined') {
        var randomSong = pickRandomSong();
        console.log("Randomly selected song:", randomSong);
        // If no index is provided, call pickRandomSong
        currentSongPath = randomSong;
        // Find the index of the selected song in the songList array
        currentSongIndex = songList.indexOf(currentSongPath);
    } else {
        // Game start logic using the provided index
        currentSongIndex = index;
        currentSongPath = songList[currentSongIndex];
    }

    // Load and play the song, initialize game variables, etc.
    currentSong = new Audio(currentSongPath);
    currentSong.volume = currentSongVolume;

    // Wait for the song to load
    currentSong.onloadedmetadata = function() {
        console.log("Loaded selected songs metadata")
        // Set BPM, MILLISECONDS_PER_BEAT, and noteSpeed based on the song
        var config = songConfigs[currentSongPath] || { BPM: 120, noteSpeed: 8 }; // Default values if song is not in the config
        BPM = config.BPM;
        MILLISECONDS_PER_BEAT = 60000 / BPM; // Calculate MILLISECONDS_PER_BEAT based on the BPM
        noteSpeed = config.noteSpeed;

        // Generate random notes based on the new BPM
        notes = generateRandomNotes(currentSong.duration * 1000);
        noteYPositions = {
            left: [],
            down: [],
            up: [],
            right: []
        };

        currentSong.play();
        songStartTime = Date.now();
        songStarted = true;
        gamePaused = false;
        gameStarted = true;

        // Clear any existing interval before setting a new one
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(updateCanvas, 16);

        console.log("Song selected: " + getSongTitle(currentSong.src), "by: " + getArtist(currentSong.src));
        console.log("Current song path:", currentSongPath);
        console.log("Beatz.io loaded and playing. Have Fun!");

        // Add event listener for the song end event
        currentSong.addEventListener('ended', onSongEnd);

        // Show the necessary buttons when the game starts
        document.getElementById("nextButton").style.display = "inline";
        document.getElementById("restartButton").style.display = "inline";
        document.getElementById("previousButton").style.display = "inline";
        document.getElementById("randomizeButton").style.display = "inline";
        document.getElementById("toggleNoteStyleButton").style.display = "inline";
        document.getElementById("fullscreen").style.display = "inline";
        document.getElementById("keybindsButton").style.display = "inline";
        document.getElementById("myYoutube").style.display = "inline";
        document.getElementById("songVol").style.display = "inline";

        document.getElementById("startButton").style.display = "none";
    };
}

// Score logic

let autoHitDisableSaving = false; // Flag to disable score saving if autoHit has been enabled

// Function to save the score to localStorage
function saveScore(song, points, perfects, misses, earlylates, maxstreak) {
    console.log("saveScore called with:", { song, points, perfects, misses, earlylates, maxstreak });

    if (autoHitDisableSaving) {
        console.log(`Score for ${song} not saved because Auto Hit was enabled during gameplay.`);
        return; // Exit early, do not save score
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
                console.log(`New best score for ${song} saved to localStorage.`);
            } else {
                console.log(`Score for ${song} is not higher than existing best score, score has not been saved.`);
            }
        } else {
            // If no existing score, save the new score
            localStorage.setItem(song, JSON.stringify(score));
            console.log(`Score for ${song} saved to localStorage as the first best score.`);
        }
    } catch (e) {
        console.error(`Error saving score for ${song} to localStorage:`, e);
    }
}

// Function to get the best score from localStorage
function getBestScore(song) {
    const score = localStorage.getItem(song);
    if (score) {
        console.log(`Best score for ${song} retrieved from localStorage.`);
        return JSON.parse(score);
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
    } else {
        console.log(`No best score for ${song} found in localStorage.`);
    }
}

// Logic to activate when the song ends
function onSongEnd() {
    let songName = getSongTitle(currentSong.src);

    try {
        saveScore(songName, points, perfectHits, totalMisses, earlyLateHits, maxStreak);
    } catch (error) {
        console.error("Error in onSongEnd:", error);
    }

    console.log("Song ended. Calling saveScore...");
    console.log("Parameters:", songName, points, perfectHits, totalMisses, earlyLateHits, maxStreak);


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
    ctx.drawImage(BGbright, 0, 0, 1280, 720);

    // Draw "Song completed!" text
    ctx.fillStyle = "white";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Song completed!", WIDTH / 2, HEIGHT / 2 - 150);

    // Draw song information
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
}

console.log("Functions saveScore, getBestScore, displayBestScore, and onSongEnd loaded.");

console.log("Ready to start Beatz.")

// startGame();

let gamePaused = false;
let pausedTextDrawn = false;
let endScreenDrawn = false;

function updateCanvas() {
    if (gamePaused) {
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
    if (currentSong.ended) {
        if (!endScreenDrawn) {
        // Draw end screen
        drawEndScreen();
        endScreenDrawn = true; // Set the flag to true to indicate that the end screen has been drawn
        }
        return;
    }
    
    endScreenDrawn = false;

    pausedTextDrawn = false;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.drawImage(BGbright, 0, 0, 1280, 720);

    ctx.drawImage(noteLeftIMG, noteXPositions.left - noteWidth / 2, 550, noteWidth, noteHeight);
    ctx.drawImage(noteUpIMG, noteXPositions.up - noteWidth / 2 + 15, 550, noteWidth, noteHeight);
    ctx.drawImage(noteDownIMG, noteXPositions.down - noteWidth / 2 - 15, 550, noteWidth, noteHeight);
    ctx.drawImage(noteRightIMG, noteXPositions.right - noteWidth / 2, 550, noteWidth, noteHeight);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Points: " + points, 10, 35);
    ctx.fillText("Total Misses: " + totalMisses, 10, 75);
    ctx.fillText("Perfects: " + perfectHits, 10, 115); 
    ctx.fillText("Early/Late: " + earlyLateHits, 10, 155);

    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    ctx.fillText("" + VERSION, WIDTH / 2, HEIGHT - 6);

    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("" + currentStreak, WIDTH / 2, (HEIGHT / 2) - 120);
    ctx.font = "15px Arial";
    ctx.fillText("( " + maxStreak + " )", WIDTH / 2, (HEIGHT / 2) - 160);

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
    getCover(currentSongPath);

    if (songStarted) {
        let currentTime = Date.now() - songStartTime;

        // Spawn notes based on timestamps
        for (let i = 0; i < notes.length; i++) {
            let note = notes[i];
            if (note.time <= currentTime && note.time + 1000 > currentTime) {
                if (noteYPositions[note.type].length === 0 || (HEIGHT - noteYPositions[note.type][noteYPositions[note.type].length - 1] >= MIN_NOTE_GAP)) {
                    noteYPositions[note.type].push(-noteHeight);
                }
            }
        }

        // Move and draw moving notes
        moveNotes();

        for (let type in noteYPositions) {
            for (let yPos of noteYPositions[type]) {
                let xPos = noteXPositions[type];
                switch (type) {
                    case 'left':
                        ctx.drawImage(noteLeftIMG, xPos - noteWidth / 2, yPos, noteWidth, noteHeight);
                        break;
                    case 'up':
                        ctx.drawImage(noteUpIMG, xPos - noteWidth / 2 + 15, yPos, noteWidth, noteHeight);
                        break;
                    case 'down':
                        ctx.drawImage(noteDownIMG, xPos - noteWidth / 2 - 15, yPos, noteWidth, noteHeight);
                        break;
                    case 'right':
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

        // Display "Auto Hit: On" text if auto-hit is enabled
        if (autoHitEnabled) {
            drawAutoHitText();
        }
    }
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
        setTimeout(() => { upPressed = false; }, 100);
    } else if (type === "down") {
        downPressed = true;
        setTimeout(() => { downPressed = false; }, 100);
    } else if (type === "left") {
        leftPressed = true;
        setTimeout(() => { leftPressed = false; }, 100);
    } else if (type === "right") {
        rightPressed = true;
        setTimeout(() => { rightPressed = false; }, 100);
    }
}

function moveNotes() {
    for (let type in noteYPositions) {
        for (let i = 0; i < noteYPositions[type].length; i++) {
            noteYPositions[type][i] += noteSpeed;
        }
        noteYPositions[type] = noteYPositions[type].filter(yPos => yPos <= HEIGHT);
    }
}

function checkHits() {
    if (leftPressed) {
        let xPos = noteXPositions.left;
        ctx.drawImage(noteLeftPressIMG, xPos - noteWidth / 2, 550, noteWidth, noteHeight);
        checkHit('left');
    }
    if (downPressed) {
        let xPos = noteXPositions.down;
        ctx.drawImage(noteDownPressIMG, xPos - noteWidth / 2 - 15, 550, noteWidth, noteHeight);
        checkHit('down');
    }
    if (upPressed) {
        let xPos = noteXPositions.up;
        ctx.drawImage(noteUpPressIMG, xPos - noteWidth / 2 + 15, 550, noteWidth, noteHeight);
        checkHit('up');
    }
    if (rightPressed) {
        let xPos = noteXPositions.right;
        ctx.drawImage(noteRightPressIMG, xPos - noteWidth / 2, 550, noteWidth, noteHeight);
        checkHit('right');
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
            }

            // Update streaks
            currentStreak++;
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }

            noteYPositions[noteType].splice(i, 1);
            let hitSound = hitSounds[currentHitSoundIndex];
            hitSound.currentTime = 0;
            hitSound.play();
            currentHitSoundIndex = (currentHitSoundIndex + 1) % MAX_HIT_SOUNDS;
            break;
        }
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
    const noteTypes = ['left', 'down', 'up', 'right'];
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