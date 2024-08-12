/**
 * Title: Beatz's Settings
 * Author: Victor//GuayabR
 * Date: 2/06/2024
 * Version: MOBILE's Settings 4.1 test (release.version.subversion.bugfix)
 * GitHub Repository: https://github.com/GuayabR/Beatz
 **/

document.addEventListener("keydown", keyDownFunction);
document.addEventListener("keyup", keyUpFunction);

function detectDeviceType() {
    const userAgent = navigator.userAgent || window.opera;

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    if (/CrOS/.test(userAgent)) {
        return "Chromebook";
    }

    if (/Mobile|iP(hone|od)|IEMobile|Windows Phone|kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        return "Mobile";
    }
    return "Desktop";
}

function handleChange() {
    // Call resizeCanvas and checkOrientation on window resize
    window.addEventListener("resize", () => {
        resizeCanvas();
        checkOrientation();
    });

    // Initial call
    resizeCanvas();
    checkOrientation();
}

function detectAndHandleDevice() {
    const pauseButton = document.getElementById("togglePauseMBL");
    const pauseMargin = document.getElementById("pauseMargin");
    const pauseMargin2 = document.getElementById("pauseMargin2");
    if (userDevice === "Mobile" || userDevice === "iOS" || userDevice === "Android") {
        isMobile = true;
        console.log("Mobile mode is enabled from previous session.");
        handleChange();
        setupMobileEventListeners();
        changeStylesheet("mobileStyles.css");
    } else if (userDevice === "Chromebook") {
        console.warn("Chromebook detected. Game might have reduced framerates.");
        isMobile = false;
        document.getElementById("orientationMessage").style.display = "none";
        if (pauseButton) {
            pauseButton.remove();
            pauseMargin.remove();
            pauseMargin2.remove();
        }
    } else if (userDevice === "Desktop") {
        console.log("Desktop device is supported. Enjoy Beatz!");
        isMobile = false;
        document.getElementById("orientationMessage").style.display = "none";
        if (pauseButton) {
            pauseButton.remove();
            pauseMargin.remove();
            pauseMargin2.remove();
        }
    }
}

function changeStylesheet(sheetName) {
    const link = document.getElementById("stylesheet");
    if (link) {
        link.href = sheetName;
    } else {
        // If no link element exists, create one
        const newLink = document.createElement("link");
        newLink.id = "stylesheet";
        newLink.rel = "stylesheet";
        newLink.href = sheetName;
        document.head.appendChild(newLink);
    }
}

function setupMobileEventListeners() {
    canvas.addEventListener("touchstart", handleTouchStart, false);
    canvas.addEventListener("touchend", handleTouchEnd, false);
    canvas.addEventListener("touchcancel", handleTouchEnd, false);
    canvas.removeEventListener("mousedown", handleMouseDown, false);
    canvas.removeEventListener("mouseup", handleMouseUp, false);
    canvas.removeEventListener("mouseleave", handleMouseUp, false);
}

function toggleNoteStyleButtonDisplay() {
    const toggleNoteStyleButton = document.getElementById("toggleNoteStyleButton");
    const currentNoteStyle = localStorage.getItem("noteStyle") || "arrows";

    if (currentNoteStyle === "arrows") {
        toggleNoteStyleButton.innerHTML = '<i class="fa-solid fa-arrow-up" style="display: none;"></i> <i class="fa-solid fa-circle"></i>';
    } else {
        toggleNoteStyleButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i> <i class="fa-solid fa-circle" style="display: none;"></i>';
    }
}

function NewTab() {
    // My YouTube
    window.open("https://www.youtube.com/@GuayabR", "_blank");
}

function email() {
    // Contact
    window.open("mailto:antonviloriavictorgabriel@gmail.com");
}

const testingVerHTML = "BeatzGameTesting.html";
const publicVerHTML = "index.html";

const testingVerJS = "BeatzGameTesting.js";
const publicVerJS = "BeatzGame.js";

function toVersion() {
    // Get the current document's URL
    const currentURL = document.location.href;

    // Determine the current HTML file based on the document URL
    const currentHTMLFile = currentURL.includes(testingVerHTML) ? testingVerHTML : publicVerHTML;
    const targetHTMLFile = currentHTMLFile === testingVerHTML ? publicVerHTML : testingVerHTML;

    // Switch to the target version
    window.location.href = targetHTMLFile;
}

function toRepo() {
    // Go to GitHub repository for Beatz!
    window.open("https://github.com/GuayabR/Beatz");
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        console.log("Entered Fullscreen");
        if (userDevice === "Chromebook") {
            canvas.style.scale = "1";
        }
    } else {
        document.exitFullscreen();
        console.log("Exited Fullscreen");
        if (userDevice === "Chromebook") {
            canvas.style.scale = "0.9";
        }
    }
}

document.addEventListener("fullscreenchange", function () {
    if (document.fullscreenElement) {
        canvas.style.cursor = "none";
        if (!backgroundIsDefault) {
            // If the background is transparent, when on fullscreen, ensure no black screen is shown and displays the HTML background
            canvas.style.background = "url('Resources/BackgroundHtml2.png')";
            canvas.style.backgroundSize = "cover";
            canvas.style.backgroundPosition = "center";
        }
    } else {
        canvas.style.cursor = "default";
        if (!backgroundIsDefault) {
            canvas.style.background = "transparent"; // If the background is transparent, when fullscreen is toggled off, make the canvas transparent again
        }
    }
});

// Settings
const modal = document.getElementById("keybindsModal");
const btn = document.getElementById("keybindsButton");
const span = document.getElementById("closeSettings");
const resetButton = document.getElementById("resetKeybindsButton");
const saveMessage = document.getElementById("settingsSaved");
const saveBtn = document.getElementById("saveSettingsBtn");

// Setting presets
const presetsModal = document.getElementById("presetModal");
const openP = document.getElementById("presetSettingsButton");
const closeP = document.getElementById("closePresets");

openP.onclick = function () {
    openPresets();
};

closeP.onclick = function () {
    closePresets();
};

saveBtn.onclick = function () {
    saveSettings();
};

function openPresets() {
    modal.style.display = "none";
    saveMessage.style.display = "none";
    presetsModal.style.display = "block";
}

function closePresets() {
    presetsModal.style.display = "none";
    modal.style.display = "block";
    document.getElementById("presetDescription").style.display = "none";
    document.getElementById("presetSaved").style.display = "none";
}

// Variable to store the selected preset name to then give to applyPreset(presetName)
let selectedPreset = "";

// Event listener for preset button click
document.getElementById("presetGuayabR").addEventListener("click", function () {
    showPresetDescription("GuayabR");
    selectedPreset = "GuayabR";
});

// Event listener for preset button click
document.getElementById("presetVERIDIAN").addEventListener("click", function () {
    showPresetDescription("VERIDIAN");
    selectedPreset = "VERIDIAN";
});

document.getElementById("applyPresetButton").addEventListener("click", function () {
    applyPreset(selectedPreset); // Apply the selected preset
    document.getElementById("presetSaved").style.display = "block"; // Show the saved message
    setTimeout(() => {
        document.getElementById("presetSaved").style.display = "none"; // Hide the saved message after 2 seconds
    }, 2000);
});

// Function to show what this preset is going to change
function showPresetDescription(presetName) {
    if (presetName === "GuayabR") {
        document.getElementById("presetDescription").innerHTML = "A - S - K - L Keybinding layout.<br>Transparent BG - 10px blur.";
    } else if (presetName === "VERIDIAN") {
        document.getElementById("presetDescription").innerHTML = "D - F - J - K Keybinding layout.<br>Fullscreen: G<br>Default BG.";
    }
    document.getElementById("presetDescription").style.display = "block";
}

const Presets = {
    GuayabR: {
        keybinds: {
            left: ["A"],
            up: ["S"],
            down: ["K"],
            right: ["L"],
            pause: ["ESCAPE"],
            autoHit: ["1"],
            previous: ["Q"],
            restart: ["R"],
            next: ["E"],
            randomize: ["T"],
            toggleNoteStyle: ["C"],
            fullscreen: ["F"],
        },
        miscellaneous: {
            defaultNoteStyle: "arrows",
            songTimeoutAfterSongEnd: false,
            songTimeoutAfterSongEndNum: 5000,
            vinylRotation: true,
            circularImage: true,
            backgroundForCanvas: "transparentBG",
            customBackgroundBlur: "10",
            customBackground: "",
            logKeys: false,
            logKeys: false,
            hitSound: "defaultHit",
            saveSongUsingControllers: false,
        },
    },
    VERIDIAN: {
        keybinds: {
            left: ["D"],
            up: ["F"],
            down: ["J"],
            right: ["K"],
            pause: ["ESCAPE"],
            autoHit: ["1"],
            previous: ["Q"],
            restart: ["R"],
            next: ["E"],
            randomize: ["T"],
            toggleNoteStyle: ["C"],
            fullscreen: ["G"],
        },
        miscellaneous: {
            defaultNoteStyle: "circles",
            songTimeoutAfterSongEnd: false,
            songTimeoutAfterSongEndNum: 5000,
            vinylRotation: true,
            circularImage: true,
            backgroundForCanvas: "defaultBG",
            customBackgroundBlur: "0",
            customBackground: "",
            logKeys: false,
            hitSound: "defaultHit",
            saveSongUsingControllers: false,
        },
    },
};

// Function to apply the preset based on the one you chose
function applyPreset(presetName) {
    const preset = Presets[presetName];

    // Apply keybinds
    keybinds = preset.keybinds;
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

    // Apply miscellaneous settings
    miscellaneous = preset.miscellaneous;
    document.getElementById("defaultNoteStyle").value = miscellaneous.defaultNoteStyle;
    document.getElementById("songTimeoutAfterSongEnd").checked = miscellaneous.songTimeoutAfterSongEnd;
    document.getElementById("songTimeoutAfterSongEndNum").value = miscellaneous.songTimeoutAfterSongEndNum;
    document.getElementById("vinylRotation").checked = miscellaneous.vinylRotation;
    document.getElementById("circularImage").checked = miscellaneous.circularImage;
    document.getElementById("defaultBackground").value = miscellaneous.backgroundForCanvas;
    document.getElementById("backdropBlurInput").value = miscellaneous.customBackgroundBlur;
    document.getElementById("logKeysCheck").checked = miscellaneous.logKeys;
    document.getElementById("defaultHitSound").value = miscellaneous.hitSound;
    document.getElementById("saveRecentSongs").checked = miscellaneous.saveSongUsingControllers;

    if (miscellaneous.backgroundForCanvas === "customBG" && miscellaneous.customBackground) {
        document.getElementById("customBGLabel").style.display = "inline";
        document.getElementById("customBGInput").style.display = "inline";
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
    } else if (miscellaneous.backgroundForCanvas === "transparentBG") {
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
    } else {
        document.getElementById("customBGLabel").style.display = "none";
        document.getElementById("customBGInput").style.display = "none";
        document.getElementById("customTransparentBGblur").style.display = "none";
        document.getElementById("backdropBlurInput").style.display = "none";
    }

    saveSettings();
}

function convertToUpperCase(inputElement) {
    inputElement.value = inputElement.value.toUpperCase();
}
document.querySelectorAll('input[type="text"]').forEach(function (input) {
    // Make every character pressed an uppercase letter
    input.addEventListener("input", function () {
        convertToUpperCase(input);
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
    // When you click off the modal, it closes
    if (event.target == modal) {
        closeModal();
        closePresets();
    }
};

resetButton.onclick = function () {
    resetSettings();
};

function openModal() {
    modal.style.display = "block";
    loadSettings();
    deactivateKeybinds();
}

function closeModal() {
    modal.style.display = "none";
    saveMessage.style.display = "none";
    activateKeybinds();
}

document.addEventListener("keydown", function (event) {
    // When P is pressed, modal is opened, if P is pressed again inside the modal, dont load the settings again, escape closes the modal
    if (modal.style.display === "block") {
        if (event.key === "P" || event.key === "p") {
            event.stopPropagation();
            console.log("P key pressed. Modal is already open, no action taken.");
        } else if (event.key === "Escape" || event.key === "escape") {
            closeModal();
            console.log("Escape key pressed. Modal closed.");
        }
        return;
    }

    if (presetsModal.style.display === "block") {
        if (event.key === "Escape" || event.key === "escape") {
            closePresets();
            console.log("Escape key pressed. Setting presets closed.");
        }
        return;
    }

    if (songListModal.style.display === "block") {
        if (event.key === "Escape" || event.key === "escape") {
            if (searchInput.value !== "") {
                searchInput.value = "";
                filterSongs();
                console.log("Escape key pressed. Search input cleared.");
            } else {
                closeSongList();
                console.log("Escape key pressed. Song list closed.");
            }
        }
        return;
    }

    if (selectedSongModal.style.display === "block") {
        if (event.key === "Escape" || event.key === "escape") {
            closeSelectedSongModal();
            console.log("Escape key pressed. Song modal closed.");
        }
        return;
    }

    // Check if no modals are currently open
    const isModalOpen = isAnyModalOpen(); // Implement this function to check if any modal is open

    // If "P" key is pressed and no modals are open, open the modal
    if ((event.key === "P" || event.key === "p") && !isModalOpen) {
        openModal();
        console.log("P key pressed. Modal opened.");
    }

    // If "O" key is pressed and no modals are open, open the song list
    if ((event.key === "O" || event.key === "o") && !isModalOpen) {
        openSongList();
        console.log("O key pressed. Song list opened.");
    }
});

// Function to check if any modal is currently open
function isAnyModalOpen() {
    const selectedSongModal = document.getElementById("selectedSongModal");
    const songListModal = document.getElementById("songListModal");

    return selectedSongModal.style.display === "block" || songListModal.style.display === "block";
}

function deactivateKeybinds() {
    // Deactivate all keys except the enter key
    document.removeEventListener("keydown", keyDownFunction);
    document.removeEventListener("keyup", keyUpFunction);
    document.addEventListener("keydown", filterKeys);
}

function activateKeybinds() {
    // Activate back all keys
    document.removeEventListener("keydown", filterKeys);
    document.addEventListener("keydown", keyDownFunction);
    document.addEventListener("keyup", keyUpFunction);
}

function filterKeys(event) {
    // If enter is pressed inside the settings modal, save the settings
    if (event.key === "Enter" || event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();

        saveSettings(); // Save settings
        console.log("Enter key pressed. Settings saved.");
    }
}

function toggleKeyLogger() {
    logKeys = document.getElementById("logKeysCheck").checked;
    console.log("Key logging is now", logKeys ? "enabled" : "disabled");
}

function toggleSavingSongs() {
    saveSongUsingControllers = document.getElementById("saveRecentSongs").checked;
    console.log("Song saving is now", saveSongUsingControllers ? "enabled" : "disabled");
}

const defaultKeybinds = {
    up: ["W"],
    left: ["A"],
    down: ["S"],
    right: ["D"],
    pause: ["ESCAPE"],
    autoHit: ["1"],
    previous: ["Q"],
    restart: ["R"],
    next: ["E"],
    randomize: ["T"],
    toggleNoteStyle: ["C"],
    fullscreen: ["F"],
};

const defaultMiscellaneous = {
    noteStyle: "arrows",
    songTimeoutAfterSongEnd: false,
    songTimeoutDelay: 5000,
    vinylRotation: false,
    circularImage: false,
    backgroundOption: "defaultBG",
    customBackgroundBlur: "0px",
    logKeys: false,
    hitSound: "defaultHit",
    saveSongUsingControllers: false,
};

var saveSongUsingControllers = false;

let logKeys = true;

let keybinds = { ...defaultKeybinds };
let miscellaneous = { ...defaultMiscellaneous };

let keybindsHistory = [];
let miscellaneousHistory = [];
let keybindsIndex = -1;

function loadSettings() {
    const savedKeybinds = JSON.parse(localStorage.getItem("keybinds")) || {};
    const savedMiscellaneous = JSON.parse(localStorage.getItem("miscellaneous")) || {};

    keybinds = { ...savedKeybinds };
    miscellaneous = { ...savedMiscellaneous };

    document.getElementById("logKeysCheck").checked = miscellaneous.logKeys;
    logKeys = miscellaneous.logKeys;

    document.getElementById("saveRecentSongs").checked = miscellaneous.saveSongUsingControllers;
    saveSongUsingControllers = miscellaneous.saveSongUsingControllers;

    document.getElementById("songTimeoutAfterSongEnd").checked = miscellaneous.songTimeoutAfterSongEnd;
    restartSongTimeout = miscellaneous.songTimeoutAfterSongEnd;

    document.getElementById("circularImage").checked = miscellaneous.circularImage;
    circularImageEnabled = miscellaneous.circularImage;
    toggleVinylRotation();

    const vinylRotationCheckbox = document.getElementById("vinylRotation");
    vinylRotationCheckbox.checked = miscellaneous.vinylRotation;
    vinylRotationEnabled = miscellaneous.vinylRotation;

    const defaultNoteStyleDropdown = document.getElementById("defaultNoteStyle");
    defaultNoteStyleDropdown.value = miscellaneous.noteStyle;

    const hitSoundDropdown = document.getElementById("defaultHitSound");
    hitSoundDropdown.value = miscellaneous.hitSound;

    const loggingKeysCheck = document.getElementById("logKeysCheck");
    loggingKeysCheck.value = miscellaneous.logKeys;

    const savingSongs = document.getElementById("saveRecentSongs");
    savingSongs.value = miscellaneous.saveSongUsingControllers;

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
    document.getElementById("songTimeoutAfterSongEndNum").value = miscellaneous.songTimeoutDelay;

    const savedBackgroundOption = savedMiscellaneous.backgroundOption || "defaultBG";
    const savedCustomBackgroundBlur = savedMiscellaneous.customBackgroundBlur || "0px";
    const savedCustomBG = localStorage.getItem("customBackground");

    if (savedBackgroundOption) {
        defaultBackground.value = savedBackgroundOption;
        if (savedBackgroundOption === "customBG" && savedCustomBG) {
            BGbright.src = savedCustomBG;
        }
    }

    // Add event listener for background option change
    defaultBackground.addEventListener("change", function () {
        const selectedOption = this.value;
        savedMiscellaneous.backgroundOption = selectedOption;
        localStorage.setItem("miscellaneous", JSON.stringify(savedMiscellaneous));

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

    const savedCustomBackground = localStorage.getItem("customBackground");

    switch (savedMiscellaneous.backgroundOption) {
        case "defaultBG":
            BGbright.src = "Resources/Background2.png";
            backgroundIsDefault = true;
            break;
        case "defaultBG2":
            BGbright.src = "Resources/Background3.jpg";
            backgroundIsDefault = true;
            break;
        case "defaultBG3":
            BGbright.src = "Resources/Background4.png";
            backgroundIsDefault = true;
            break;
        case "defaultBG4":
            BGbright.src = "Resources/Background5.jpg";
            backgroundIsDefault = true;
            break;
        case "htmlBG":
            BGbright.src = "Resources/BackgroundHtml2.png";
            backgroundIsDefault = true;
            break;
        case "transparentBG":
            canvas.style.background = "transparent";
            canvas.style.backdropFilter = `blur(${savedCustomBackgroundBlur}px)`;
            backgroundIsDefault = false;
            break;
        case "customBG":
            if (savedCustomBackground) {
                BGbright.src = savedCustomBackground;
            }
            backgroundIsDefault = true;
            break;
        default:
            BGbright.src = "Resources/Background2.png";
            backgroundIsDefault = true;
    }

    initializeHitSounds(miscellaneous.hitSound);

    console.log("Loaded settings", keybinds, miscellaneous);
}

function getFileDataUrl(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result);
    };
    reader.readAsDataURL(file);
}

function saveSettings() {
    const newKeybinds = {
        up: document
            .getElementById("up")
            .value.split(", ")
            .map(key => key.trim()),
        left: document
            .getElementById("left")
            .value.split(", ")
            .map(key => key.trim()),
        down: document
            .getElementById("down")
            .value.split(", ")
            .map(key => key.trim()),
        right: document
            .getElementById("right")
            .value.split(", ")
            .map(key => key.trim()),
        pause: document
            .getElementById("pause")
            .value.split(", ")
            .map(key => key.trim()),
        autoHit: document
            .getElementById("autoHit")
            .value.split(", ")
            .map(key => key.trim()),
        previous: document
            .getElementById("previousInput")
            .value.split(", ")
            .map(key => key.trim()),
        restart: document
            .getElementById("restartInput")
            .value.split(", ")
            .map(key => key.trim()),
        next: document
            .getElementById("nextInput")
            .value.split(", ")
            .map(key => key.trim()),
        randomize: document
            .getElementById("randomize")
            .value.split(", ")
            .map(key => key.trim()),
        toggleNoteStyle: document
            .getElementById("toggleNoteStyleInput")
            .value.split(", ")
            .map(key => key.trim()),
        fullscreen: document
            .getElementById("fullscreenInput")
            .value.split(", ")
            .map(key => key.trim()),
    };

    const newMiscellaneous = {
        noteStyle: document.getElementById("defaultNoteStyle").value,
        songTimeoutAfterSongEnd: document.getElementById("songTimeoutAfterSongEnd").checked,
        songTimeoutDelay: parseInt(document.getElementById("songTimeoutAfterSongEndNum").value) || defaultMiscellaneous.songTimeoutDelay,
        vinylRotation: document.getElementById("vinylRotation").checked,
        circularImage: document.getElementById("circularImage").checked,
        backgroundOption: document.getElementById("defaultBackground").value,
        customBackgroundBlur: document.getElementById("backdropBlurInput").value,
        logKeys: document.getElementById("logKeysCheck").checked,
        hitSound: document.getElementById("defaultHitSound").value,
        saveSongUsingControllers: document.getElementById("saveRecentSongs").checked,
    };

    // Compare new settings with saved settings
    // const savedKeybinds = JSON.parse(localStorage.getItem("keybinds")) || {};
    // const savedMiscellaneous = JSON.parse(localStorage.getItem("miscellaneous")) || {};

    // Proceed with saving settings
    if (vinylRotationEnabled && !newMiscellaneous.vinylRotation) {
        rotationAngle = 0;
    }

    // Apply the changes
    restartSongTimeout = newMiscellaneous.songTimeoutAfterSongEnd;
    vinylRotationEnabled = newMiscellaneous.vinylRotation;
    circularImageEnabled = newMiscellaneous.circularImage;
    logKeys = newMiscellaneous.logKeys;
    saveSongUsingControllers = newMiscellaneous.saveSongUsingControllers;

    const timeoutInputValue = newMiscellaneous.songTimeoutDelay;

    if (isNaN(timeoutInputValue)) {
        alert("Please enter a valid number for the timeout delay.");
        return;
    }
    if (timeoutInputValue > 15000) {
        alert("Please enter a number that is below 15,000.");
        return;
    }

    const blurInput = newMiscellaneous.customBackgroundBlur;
    const blurValue = parseInt(blurInput, 10);
    if (isNaN(blurValue) || blurValue < 0 || blurValue >= 1000) {
        alert("Please enter a number between 0 and 1000 for the blur value.");
        return;
    }

    switch (newMiscellaneous.backgroundOption) {
        case "defaultBG":
            BGbright.src = "Resources/Background2.png";
            backgroundIsDefault = true;
            break;
        case "defaultBG2":
            BGbright.src = "Resources/Background3.jpg";
            backgroundIsDefault = true;
            break;
        case "defaultBG3":
            BGbright.src = "Resources/Background4.png";
            backgroundIsDefault = true;
            break;
        case "defaultBG4":
            BGbright.src = "Resources/Background5.jpg";
            backgroundIsDefault = true;
            break;
        case "htmlBG":
            BGbright.src = "Resources/BackgroundHtml2.png";
            backgroundIsDefault = true;
            break;
        case "transparentBG":
            canvas.style.background = "transparent";
            canvas.style.backdropFilter = `blur(${newMiscellaneous.customBackgroundBlur}px)`;
            backgroundIsDefault = false;
            break;
        case "customBG":
            const file = document.getElementById("customBGInput").files[0];
            if (file) {
                handleFileUpload(file);
            }
            backgroundIsDefault = true;
            break;
        default:
            BGbright.src = "Resources/Background2.png";
            backgroundIsDefault = true;
    }

    localStorage.setItem("keybinds", JSON.stringify(newKeybinds));
    localStorage.setItem("miscellaneous", JSON.stringify(newMiscellaneous));

    keybinds = { ...newKeybinds };
    miscellaneous = { ...newMiscellaneous };

    // Reset and initialize hit sounds
    hitSounds = [];
    initializeHitSounds(miscellaneous.hitSound);

    saveMessage.style.display = "block";
    saveMessage.innerHTML = "Settings saved!<br><br>";
    setTimeout(() => {
        saveMessage.style.display = "none";
    }, 2500); // Hide the message after 2.5 seconds

    console.log("Saved settings", keybinds, miscellaneous);
}

function handleFileUpload(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const imageData = e.target.result;

        localStorage.setItem("customBackground", imageData);
        BGbright.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

function applyDefaultNoteStyle() {
    const noteStyle = localStorage.getItem("noteStyle") || defaultMiscellaneous.noteStyle;
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
        console.log("Switching to circles...");
        switchToCircles();
        localStorage.setItem("noteStyle", "circles");
        noteStyleButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        console.log("Note style switched to circles.");
    } else {
        console.log("Switching to arrows...");
        switchToArrows();
        localStorage.setItem("noteStyle", "arrows");
        noteStyleButton.innerHTML = '<i class="fa-solid fa-circle"></i>';
        console.log("Note style switched to arrows.");
    }
}

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

// Reset keybinds and miscellaneous settings to default values
function resetSettings() {
    if (confirm("Are you sure you want to reset all settings to their default values?")) {
        localStorage.removeItem("keybinds");
        localStorage.removeItem("miscellaneous");
        keybinds = { ...defaultKeybinds };
        miscellaneous = { ...defaultMiscellaneous };
        updateKeybindsFields();
        loadSettings();
        saveMessage.innerHTML = "Settings have been reset.<br><br>";
        saveMessage.style.display = "block";
    }
}

// Undo keybinds and miscellaneous settings
function undoKeybinds() {
    if (keybindsIndex > 0) {
        keybindsIndex--;
        keybinds = JSON.parse(keybindsHistory[keybindsIndex]);
        miscellaneous = JSON.parse(miscellaneousHistory[keybindsIndex]);
        updateKeybindsFields();
    }
}

// Redo keybinds and miscellaneous settings
function redoKeybinds() {
    if (keybindsIndex < keybindsHistory.length - 1) {
        keybindsIndex++;
        keybinds = JSON.parse(keybindsHistory[keybindsIndex]);
        miscellaneous = JSON.parse(miscellaneousHistory[keybindsIndex]);
        updateKeybindsFields();
    }
}

// Update the fields to reflect the current keybinds and miscellaneous settings
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

    document.getElementById("defaultNoteStyle").value = miscellaneous.noteStyle;
    document.getElementById("songTimeoutAfterSongEnd").checked = miscellaneous.songTimeoutAfterSongEnd;
    document.getElementById("songTimeoutAfterSongEndNum").value = miscellaneous.songTimeoutDelay;
    document.getElementById("vinylRotation").checked = miscellaneous.vinylRotation;
    document.getElementById("circularImage").checked = miscellaneous.circularImage;
    document.getElementById("defaultBackground").value = miscellaneous.backgroundOption;
    document.getElementById("backdropBlurInput").value = miscellaneous.customBackgroundBlur;
    document.getElementById("logKeysCheck").checked = miscellaneous.logKeys;

    if (miscellaneous.backgroundOption === "customBG" && miscellaneous.customBackground) {
        document.getElementById("customBGLabel").style.display = "inline";
        document.getElementById("customBGInput").style.display = "inline";
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
    } else if (miscellaneous.backgroundOption === "transparentBG") {
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
    } else {
        document.getElementById("customBGLabel").style.display = "none";
        document.getElementById("customBGInput").style.display = "none";
        document.getElementById("customTransparentBGblur").style.display = "none";
        document.getElementById("backdropBlurInput").style.display = "none";
    }
}

// Save the current keybinds and miscellaneous settings to history
function saveToHistory() {
    keybindsHistory = keybindsHistory.slice(0, keybindsIndex + 1);
    miscellaneousHistory = miscellaneousHistory.slice(0, keybindsIndex + 1);
    keybindsHistory.push(JSON.stringify(keybinds));
    miscellaneousHistory.push(JSON.stringify(miscellaneous));
    keybindsIndex++;
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
    var keyDown = keyboardEvent.key.toUpperCase();

    if (logKeys) {
        console.log("Pressed:", keyDown);
    }

    if (!gameStarted) {
        if (keyDown == "ENTER") {
            document.getElementById("startButton").click();
            gameStarted = true;
        }
        return;
    }

    if (gameStarted && keyDown == "ENTER") {
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
    if (keyboardEvent.ctrlKey && keyDown === ";") {
        toggleDebugInfo();
    }
    if (keyboardEvent.ctrlKey && keyDown === ".") {
        autoHitDisableSaving = true;
        endScreenDrawn = true;
    }
    if (keyboardEvent.ctrlKey && keyboardEvent.shiftKey && keyDown === "L") {
        toggleCanvasRefresh();
    }
    if (keyboardEvent.ctrlKey && keyboardEvent.shiftKey && keyDown === "H") {
        toggleHitboxes();
    }
    if (keyboardEvent.shiftKey && keyDown === "R") {
        legacyRestartSong();
    }
}

function keyUpFunction(keyboardEvent) {
    var keyUp = keyboardEvent.key.toUpperCase();

    if (logKeys) {
        console.log("Released:", keyUp);
    }

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

// - .  .- -- ---  .- -. --. .  .--. . .-. ---  - ..-  -. ---  .-.. ---  ... .- -... . ...  -.--  -. ---  ... .  --.- ..- .  .... .- -.-. . .-.

// Thanks for playing Beatz!
// - GuayabR.
