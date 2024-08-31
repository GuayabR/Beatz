/**
 * Title: Beatz's Settings
 * Author: Victor//GuayabR
 * Date: 2/06/2024
 * Version: LOAD//FETCH's Settings 5.0 test (release.version.subversion.bugfix)
 * GitHub Repository: https://github.com/GuayabR/Beatz
 **/

document.addEventListener("keydown", keyDownFunction);
document.addEventListener("keyup", keyUpFunction);

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
        canvasContainer.requestFullscreen().catch((err) => {
            logError(`Error attempting to enable full-screen mode: ${err} | ${err.message} | ${err.name}`);
        });
        console.log("Entered Fullscreen");
        document.body.classList.add("fullscreen"); // Add fullscreen class to body
        if (userDevice === "Chromebook") {
            canvas.style.scale = "1";
        }
    } else {
        document.exitFullscreen();
        console.log("Exited Fullscreen");
        document.body.classList.remove("fullscreen"); // Remove fullscreen class from body
        if (userDevice === "Chromebook") {
            canvas.style.scale = "0.9";
        }
    }
}

// Listen for fullscreen change events to adjust the styles of elements
document.addEventListener("fullscreenchange", function () {
    if (document.fullscreenElement === canvasContainer) {
        // Adjust styles when entering fullscreen mode
        canvas.style.cursor = "none";
        backgroundOverlay.style.cursor = "none";
        if (!backgroundIsDefault) {
            // Ensure the correct background is displayed
            BGurl = "url('Resources/BackgroundHtml2.png')";
            backgroundOverlay.style.backgroundImage = BGurl;
            backgroundOverlay.style.backgroundSize = "cover";
            backgroundOverlay.style.backgroundPosition = "center";
        }
        adjustCanvasForFullscreen();
    } else {
        // Reset styles when exiting fullscreen mode
        backgroundOverlay.style.cursor = "default";
        canvas.style.cursor = "default";
        if (!backgroundIsDefault) {
            backgroundOverlay.style.background = "transparent";
        }
        resetCanvasFromFullscreen();
    }
});

// Function to adjust canvas styles for fullscreen
function adjustCanvasForFullscreen() {
    // Get the aspect ratios
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const canvasAspectRatio = canvas.width / canvas.height;
    const containerAspectRatio = containerWidth / containerHeight;

    // Maintain aspect ratio while filling the fullscreen
    if (canvasAspectRatio > containerAspectRatio) {
        canvas.style.width = "100%";
        canvas.style.height = "auto";
    } else {
        canvas.style.width = "auto";
        canvas.style.height = "100%";
    }
}

// Function to reset canvas styles when exiting fullscreen mode
function resetCanvasFromFullscreen() {
    canvas.style.width = ""; // Reset width to default
    canvas.style.height = ""; // Reset height to default
    canvas.style.position = "absolute";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
}

// Settings
const settingsModal = document.getElementById("keybindsModal");
const openSetBtn = document.getElementById("keybindsButton");

const miscSettingsModal = document.getElementById("miscSettingsModal");

const selectedSongModal = document.getElementById("selectedSongModal");
const songListModal = document.getElementById("songListModal");

const closeSetBtn = document.getElementById("closeSettings");
const closeMiscBtn = document.getElementById("closeMiscSettingsModal");
const resetButton = document.getElementById("resetKeybindsButton");
const saveMessage = document.getElementById("settingsSaved");
const saveBtn = document.getElementById("saveSettingsBtn");

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

// Event Listeners for Modals
closeSetBtn.addEventListener("click", closeModal);
openSetBtn.addEventListener("click", openModal);
closeMiscBtn.addEventListener("click", closeMiscSettings);

document.querySelectorAll(".modal .reset-keybinds").forEach((button) => {
    button.onclick = function () {
        resetSettings();
    };
});

document.querySelectorAll(".modal .undo-keybinds").forEach((button) => {
    button.onclick = function () {
        undoKeybinds();
    };
});

document.querySelectorAll(".modal .redo-keybinds").forEach((button) => {
    button.onclick = function () {
        redoKeybinds();
    };
});

document.querySelectorAll(".modal .save-settings-btn").forEach((button) => {
    button.onclick = function () {
        saveSettings();
    };
});

window.onclick = function (event) {
    // When you click off the modal, it closes
    if (event.target == settingsModal) {
        closeModal();
        closePresets();
    }
};

function openModal() {
    if (!isMobile) {
        settingsModal.style.display = "block";
    } else {
        miscSettingsModal.style.display = "block";
        document.getElementById("switchToKeybinds").style.display = "none";
    }
    loadSettings();
    deactivateKeybinds();
}

function closeModal() {
    settingsModal.style.display = "none";
    saveMessage.style.display = "none";
    activateKeybinds();
}

// Function to check if any modal is currently open
function isSongModalOpen() {
    return selectedSongModal.style.display === "block" || songListModal.style.display === "block";
}

// Function to check which modal is currently open
function isAnyModalOpened() {
    if (selectedSongModal.style.display === "block") {
        return "selectedSongModal";
    }
    if (songListModal.style.display === "block") {
        return "songListModal";
    }
    if (settingsModal.style.display === "block") {
        return "keybindsModal";
    }
    if (settingPresets.style.display === "block") {
        return "presetModal";
    }
    if (miscSettingsModal.style.display === "block") {
        return "miscSettingsModal";
    }
    return ""; // No modal is open
}

function filterKeys(event) {
    const openedModal = isAnyModalOpened();

    // If Enter is pressed and the settings modal is open, save the settings
    if (openedModal === "keybindsModal") {
        if (event.key === "Enter" || event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();

            saveSettings(); // Save settings
            console.log("Enter key pressed. Settings saved.");
            return;
        }
        if (event.key === "Escape" || event.keyCode === 27) {
            event.preventDefault();
            event.stopPropagation();

            closeModal();
            playSoundEffect("Resources/SFX/clickBtn2.mp3", 0.7);
            console.log("Escape key pressed. Modal closed.");
            return;
        }
        if (event.key === "d" || event.keyCode === 68 || event.key === "ArrowRight" || event.keyCode === 39) {
            event.preventDefault();
            event.stopPropagation();

            switchToMiscSettings(); // Open the miscellaneous settings modal
            console.log("D or ArrowRight key pressed. Switched to Miscellaneous Settings Modal.");
            return;
        }
        if (event.key === "p" || event.keyCode === 80) {
            event.preventDefault();
            event.stopPropagation();

            openPresets(); // Close current modal and open the preset modal
            console.log("P key pressed. Switched to Preset Modal.");
            return;
        }
    }

    if (openedModal === "songListModal") {
        if (event.key === "Enter" || event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();

            playFirstResult();
            console.log("Enter key pressed. First result playing.");
            return;
        }
        if (event.key === "Escape" || event.keyCode === 27) {
            event.preventDefault();
            event.stopPropagation();

            if (searchInput.value !== "") {
                searchInput.value = "";
                filterSongs();
                console.log("Escape key pressed. Search input cleared.");
            } else {
                closeSongList();
                playSoundEffect("Resources/SFX/clickBtn2.mp3", 0.7);
                console.log("Escape key pressed. Song list closed.");
            }
            return;
        }
    }

    if (openedModal === "presetModal") {
        if (event.key === "Escape" || event.keyCode === 27) {
            event.preventDefault();
            event.stopPropagation();

            closePresets();
            playSoundEffect("Resources/SFX/clickBtn2.mp3", 0.7);
            console.log("Escape key pressed. Preset modal closed.");
            return;
        }
    }

    if (openedModal === "selectedSongModal") {
        if (event.key === "Enter" || event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();

            document.getElementById("playSongButton").click(); // Simulate click on playSongButton
            console.log("Enter key pressed. Play song button clicked.");
            return;
        }
        if (event.key === "Escape" || event.keyCode === 27) {
            event.preventDefault();
            event.stopPropagation();

            closeSelectedSongModal();
            playSoundEffect("Resources/SFX/clickBtn2.mp3", 0.7);
            console.log("Escape key pressed. Selected song modal closed.");
            return;
        }
    }

    // If Escape is pressed in the miscellaneous settings modal
    if (openedModal === "miscSettingsModal") {
        if (event.key === "Escape" || event.keyCode === 27) {
            event.preventDefault();
            event.stopPropagation();

            closeMiscSettings();
            playSoundEffect("Resources/SFX/clickBtn2.mp3", 0.7);
            console.log("Escape key pressed. Miscellaneous settings modal closed.");
            return;
        }
        if (event.key === "Enter" || event.keyCode === 27) {
            event.preventDefault();
            event.stopPropagation();

            saveSettings(); // Save settings
            console.log("Enter key pressed. Saved settings from misc modal.");
            return;
        }
        if (event.key === "a" || event.keyCode === 65 || event.key === "ArrowLeft" || event.keyCode === 37) {
            event.preventDefault();
            event.stopPropagation();

            switchToKeybindsSettings(); // Close the miscellaneous settings modal
            console.log("A or ArrowLeft key pressed. Switched to Keybinds Modal.");
            return;
        }
        if (event.key === "p" || event.keyCode === 80) {
            event.preventDefault();
            event.stopPropagation();

            openPresets(); // Close current modal and open the preset modal
            console.log("P key pressed. Switched to Preset Modal.");
            return;
        }
    }
}

function switchToMiscSettings() {
    settingsModal.style.display = "none";
    miscSettingsModal.style.display = "block";
    playSoundEffect("Resources/SFX/hoverBtn.mp3", 0.4);
}

function switchToKeybindsSettings() {
    settingsModal.style.display = "block";
    miscSettingsModal.style.display = "none";
    playSoundEffect("Resources/SFX/hoverBtn.mp3", 0.4);
}

function openMiscSettings() {
    miscSettingsModal.style.display = "block";
}

function closeMiscSettings() {
    miscSettingsModal.style.display = "none";
    activateKeybinds();
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

// Setting presets
const settingPresets = document.getElementById("presetModal");
const openP = document.getElementById("presetSettingsButton");
const closeP = document.getElementById("closePresets");

// Function to switch from Keybinds to Miscellaneous Settings
document.getElementById("switchToMiscSettings").onclick = function () {
    document.getElementById("keybindsModal").style.display = "none";
    document.getElementById("miscSettingsModal").style.display = "block";
};

// Function to switch from Miscellaneous Settings to Keybinds
document.getElementById("switchToKeybinds").onclick = function () {
    document.getElementById("miscSettingsModal").style.display = "none";
    document.getElementById("keybindsModal").style.display = "block";
};

document.querySelectorAll(".modal .preset-settings").forEach((button) => {
    button.onclick = function () {
        openPresets();
    };
});

closeP.onclick = function () {
    closePresets();
};

saveBtn.onclick = function () {
    saveSettings();
};

function openPresets() {
    settingsModal.style.display = "none";
    miscSettingsModal.style.display = "none";
    saveMessage.style.display = "none";
    settingPresets.style.display = "block";

    const onlyKeys = document.getElementById("applyPresetKeysBTN");
    const onlyMisc = document.getElementById("applyPresetMiscBTN");
    if (isMobile) {
        onlyKeys.style.display = "none";
        onlyMisc.style.display = "none";
    }
}

function closePresets() {
    settingPresets.style.display = "none";
    if (!isMobile) {
        settingsModal.style.display = "block";
    } else {
        miscSettingsModal.style.display = "block";
    }
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

// Event listener for preset button click
document.getElementById("presetOG").addEventListener("click", function () {
    showPresetDescription("OG");
    selectedPreset = "OG";
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
        if (isMobile) {
            document.getElementById("presetDescription").innerHTML =
                "Transparent BG - 10px blur.<br>Small Click Hit Sound<br>Button SFX activated.<br>Circular Cover Images.<br>Arrow Notes.";
        } else {
            document.getElementById("presetDescription").innerHTML =
                "A - S - K - L Keybinding layout.<br>Transparent BG - 10px blur.<br>Small Click Hit Sound<br>Circular Cover Images.<br>Arrow Notes.";
        }
    } else if (presetName === "VERIDIAN") {
        if (isMobile) {
            document.getElementById("presetDescription").innerHTML = "Default BG.<br>No Button SFX<br>Circular Notes.";
        } else {
            document.getElementById("presetDescription").innerHTML =
                "D - F - J - K Keybinding layout.<br>Fullscreen: G<br>Default BG.<br>No Button SFX<br>Circular Cover Images.<br>Circular Notes.";
        }
    } else if (presetName === "OG") {
        if (isMobile) {
            document.getElementById("presetDescription").innerHTML = "Default BG.<br>No Button SFX<br>Square Cover Images<br>Arrow Notes.";
        } else {
            document.getElementById("presetDescription").innerHTML =
                "A/Z - W/X - S/N - D/M Keybinding layout.<br>Default BG.<br>No Button SFX<br>Square Cover Images.<br>Arrow Notes.";
        }
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
            openSongList: ["O"],
            openSettings: ["P"]
        },
        miscellaneous: {
            defaultNoteStyle: "arrows",
            songTimeoutAfterSongEnd: false,
            songTimeoutAfterSongEndNum: 5000,
            vinylRotation: true,
            circularImage: true,
            backgroundOption: "defaultBG8",
            customBackgroundBlur: "0",
            customBackground: "",
            logKeys: false,
            hitSound: "smallClick",
            saveSongUsingControllers: false,
            fetchSongs: false,
            playSFX: true,
            pulseOnBPM: true,
            extraLog: false,
            BGbrightness: 1,
            countdownFrom: 0
        }
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
            openSongList: ["O"],
            openSettings: ["P"]
        },
        miscellaneous: {
            defaultNoteStyle: "circles",
            songTimeoutAfterSongEnd: false,
            songTimeoutAfterSongEndNum: 5000,
            vinylRotation: true,
            circularImage: true,
            backgroundOption: "defaultBG",
            customBackgroundBlur: "0",
            customBackground: "",
            logKeys: false,
            hitSound: "defaultHit",
            saveSongUsingControllers: false,
            fetchSongs: false,
            playSFX: true,
            pulseOnBPM: true,
            extraLog: false,
            BGbrightness: 1,
            countdownFrom: 3
        }
    },
    OG: {
        keybinds: {
            left: ["A, Z"],
            up: ["W, X"],
            down: ["S, N"],
            right: ["D, M"],
            pause: ["ESCAPE"],
            autoHit: ["1"],
            previous: ["Q"],
            restart: ["R"],
            next: ["E"],
            randomize: ["T"],
            toggleNoteStyle: ["C"],
            fullscreen: ["F"],
            openSongList: ["O"],
            openSettings: ["P"]
        },
        miscellaneous: {
            defaultNoteStyle: "arrows",
            songTimeoutAfterSongEnd: false,
            songTimeoutAfterSongEndNum: 5000,
            vinylRotation: false,
            circularImage: false,
            backgroundOption: "defaultBG",
            customBackgroundBlur: "0",
            customBackground: "",
            logKeys: false,
            hitSound: "defaultHit",
            saveSongUsingControllers: false,
            fetchSongs: false,
            playSFX: false,
            pulseOnBPM: false,
            extraLog: false,
            BGbrightness: 1,
            countdownFrom: 3
        }
    }
};

const marginCustomBG = document.getElementById("marginCustomBG");
const marginCustomBG2 = document.getElementById("marginCustomBG2");

const marginBlur = document.getElementById("marginBlurBG");
const marginBlur2 = document.getElementById("marginBlurBG2");

const marginSelect = document.getElementById("marginSelect");
const marginSelect2 = document.getElementById("marginSelect2");

// Function to apply the preset based on the one you chose
function applyPreset(presetName) {
    const preset = Presets[presetName];

    if (userDevice === "Desktop" || userDevice === "Chromebook") {
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
        document.getElementById("openSongL").value = keybinds.openSongList.join(", ");
        document.getElementById("openKeybindsKey").value = keybinds.openSettings.join(", ");
    }

    // Apply miscellaneous settings
    miscellaneous = preset.miscellaneous;
    document.getElementById("defaultNoteStyle").value = miscellaneous.defaultNoteStyle;
    document.getElementById("songTimeoutAfterSongEnd").checked = miscellaneous.songTimeoutAfterSongEnd;
    document.getElementById("songTimeoutAfterSongEndNum").value = miscellaneous.songTimeoutAfterSongEndNum;
    document.getElementById("vinylRotation").checked = miscellaneous.vinylRotation;
    document.getElementById("circularImage").checked = miscellaneous.circularImage;
    document.getElementById("defaultBackground").value = miscellaneous.backgroundOption;
    document.getElementById("backdropBlurInput").value = miscellaneous.customBackgroundBlur;
    document.getElementById("logKeysCheck").checked = miscellaneous.logKeys;
    document.getElementById("defaultHitSound").value = miscellaneous.hitSound;
    document.getElementById("saveRecentSongs").checked = miscellaneous.saveSongUsingControllers;
    document.getElementById("playSFXcheck").checked = miscellaneous.playSFX;
    document.getElementById("pulseOnBPMcheck").checked = miscellaneous.pulseOnBPM;
    document.getElementById("extraLogCheck").checked = miscellaneous.extraLog;
    document.getElementById("readyTimerInput").value = miscellaneous.countdownFrom;
    document.getElementById("brightnessInput").value = miscellaneous.BGbrightness;

    if (userDevice !== "iOS") {
        document.getElementById("fetchSongsSite").checked = miscellaneous.fetchSongs;
    }

    if (miscellaneous.backgroundOption === "customBG" && miscellaneous.customBackground) {
        document.getElementById("customBGLabel").style.display = "inline";
        document.getElementById("customBGInput").style.display = "inline";
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
        marginSelect.style.display = "inline";
        marginSelect2.style.display = "inline";
        marginCustomBG.style.display = "inline";
        marginCustomBG2.style.display = "inline";
        marginBlur.style.display = "inline";
        marginBlur2.style.display = "inline";
    } else if (miscellaneous.backgroundOption === "transparentBG") {
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
        marginSelect.style.display = "inline";
        marginSelect2.style.display = "inline";
        marginBlur.style.display = "inline";
        marginBlur2.style.display = "inline";
    } else {
        document.getElementById("customBGLabel").style.display = "none";
        document.getElementById("customBGInput").style.display = "none";
        document.getElementById("customTransparentBGblur").style.display = "none";
        document.getElementById("backdropBlurInput").style.display = "none";
        marginSelect.style.display = "none";
        marginSelect2.style.display = "none";
        marginCustomBG.style.display = "none";
        marginCustomBG2.style.display = "none";
        marginBlur.style.display = "none";
        marginBlur2.style.display = "none";
    }

    saveSettings();
    logNotice(`Applied preset: ${presetName}`);
    setTimeout(loadSettings, 100);
}

// Function to apply the preset based on the one you chose
function applyPresetKeys(presetName) {
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
    document.getElementById("openSongL").value = keybinds.openSongList.join(", ");
    document.getElementById("openKeybindsKey").value = keybinds.openSettings.join(", ");

    saveSettings();
    logNotice(`Applied preset's keybinds: ${presetName}`);
    setTimeout(loadSettings, 100);
}

// Function to apply the preset based on the one you chose
function applyPresetMisc(presetName) {
    const preset = Presets[presetName];

    // Apply miscellaneous settings
    miscellaneous = preset.miscellaneous;
    document.getElementById("defaultNoteStyle").value = miscellaneous.defaultNoteStyle;
    document.getElementById("songTimeoutAfterSongEnd").checked = miscellaneous.songTimeoutAfterSongEnd;
    document.getElementById("songTimeoutAfterSongEndNum").value = miscellaneous.songTimeoutAfterSongEndNum;
    document.getElementById("vinylRotation").checked = miscellaneous.vinylRotation;
    document.getElementById("circularImage").checked = miscellaneous.circularImage;
    document.getElementById("defaultBackground").value = miscellaneous.backgroundOption;
    document.getElementById("backdropBlurInput").value = miscellaneous.customBackgroundBlur;
    document.getElementById("logKeysCheck").checked = miscellaneous.logKeys;
    document.getElementById("defaultHitSound").value = miscellaneous.hitSound;
    document.getElementById("saveRecentSongs").checked = miscellaneous.saveSongUsingControllers;
    document.getElementById("playSFXcheck").checked = miscellaneous.playSFX;
    document.getElementById("pulseOnBPMcheck").checked = miscellaneous.pulseOnBPM;
    document.getElementById("extraLogCheck").checked = miscellaneous.extraLog;
    document.getElementById("readyTimerInput").value = miscellaneous.countdownFrom;
    document.getElementById("brightnessInput").value = miscellaneous.BGbrightness;

    if (userDevice !== "iOS") {
        document.getElementById("fetchSongsSite").checked = miscellaneous.fetchSongs;
    }

    const marginCustomBG = document.getElementById("marginCustomBG");
    const marginCustomBG2 = document.getElementById("marginCustomBG2");

    const marginBlur = document.getElementById("marginBlurBG");
    const marginBlur2 = document.getElementById("marginBlurBG2");

    const marginSelect = document.getElementById("marginSelect");
    const marginSelect2 = document.getElementById("marginSelect2");

    if (miscellaneous.backgroundOption === "customBG" && miscellaneous.customBackground) {
        document.getElementById("customBGLabel").style.display = "inline";
        document.getElementById("customBGInput").style.display = "inline";
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
        marginSelect.style.display = "inline";
        marginSelect2.style.display = "inline";
        marginCustomBG.style.display = "inline";
        marginCustomBG2.style.display = "inline";
        marginBlur.style.display = "inline";
        marginBlur2.style.display = "inline";
    } else if (miscellaneous.backgroundOption === "transparentBG") {
        document.getElementById("customTransparentBGblur").style.display = "inline";
        document.getElementById("backdropBlurInput").style.display = "inline";
        marginSelect.style.display = "inline";
        marginSelect2.style.display = "inline";
        marginBlur.style.display = "inline";
        marginBlur2.style.display = "inline";
    } else {
        document.getElementById("customBGLabel").style.display = "none";
        document.getElementById("customBGInput").style.display = "none";
        document.getElementById("customTransparentBGblur").style.display = "none";
        document.getElementById("backdropBlurInput").style.display = "none";
        marginSelect.style.display = "none";
        marginSelect2.style.display = "none";
        marginCustomBG.style.display = "none";
        marginCustomBG2.style.display = "none";
        marginBlur.style.display = "none";
        marginBlur2.style.display = "none";
    }

    saveSettings();
    logNotice(`Applied preset's miscellaneous: ${presetName}`);
    setTimeout(loadSettings, 100);
}

function toggleKeyLogger() {
    logKeys = document.getElementById("logKeysCheck").checked;
    console.log("Key logging is now", logKeys ? "enabled" : "disabled");
}

function toggleSavingSongs() {
    saveSongUsingControllers = document.getElementById("saveRecentSongs").checked;
    console.log("Song saving is now", saveSongUsingControllers ? "enabled" : "disabled");
}

function togglePlaySFX() {
    playSFX = document.getElementById("playSFXcheck").checked;
    playSoundEffect("Resources/SFX/clickBtn2.mp3", 1);
    console.log("Playing SFX is now", playSFX ? "enabled" : "disabled");
}

function toggleFetchingSongs() {
    fetchSongs = !fetchSongs;
    console.log("fetchSongs is now", fetchSongs ? "enabled" : "disabled");
}

function toggleExtraLogs() {
    extraLog = !extraLog;
    console.log("Extra notices are now", extraLog ? "enabled" : "disabled");
}

function togglePulseOnBPM() {
    pulseOnBPM = !pulseOnBPM;
    console.log("pulseOnBPM is now", pulseOnBPM ? "enabled" : "disabled");

    if (pulseOnBPM) {
        // Call the function to show the popup message
        logNotice("Elements will pulse next time you start a song.");
    }
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
    openSongList: ["O"],
    openSettings: ["P"]
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
    fetchSongs: false,
    playSFX: true,
    pulseOnBPM: true,
    extraLog: false,
    BGbrightness: 1,
    countdownFrom: 3
};

let countdownFrom;

let BGbrightness = 1;

let saveSongUsingControllers = false;

let logKeys = true;

let fetchSongs = false; // Fetch songs from guayabr.github.io

let playSFX = true;

let pulseOnBPM = true;

let BGurl = "url('Resources/defaultBG.png";

let keybinds = { ...defaultKeybinds };
let miscellaneous = { ...defaultMiscellaneous };

let keybindsHistory = [];
let miscellaneousHistory = [];
let keybindsIndex = -1;

let extraLog = false;

function loadSettings() {
    const savedKeybinds = JSON.parse(localStorage.getItem("keybinds")) || defaultKeybinds;
    const savedMiscellaneous = JSON.parse(localStorage.getItem("miscellaneous")) || defaultMiscellaneous;

    if (userDevice === "Desktop" || userDevice === "Chromebook") {
        keybinds = { ...defaultKeybinds, ...savedKeybinds };
        updateKeybindsFields();
    }

    miscellaneous = { ...defaultMiscellaneous, ...savedMiscellaneous };

    // Automatically set fetchSongs to true if userDevice is iOS
    if (userDevice === "iOS" && miscellaneous.fetchSongs === false) {
        fetchSongs = true;
        miscellaneous.fetchSongs = true;
        console.log("iPhone detected. Fetching songs...");
        setTimeout(() => {
            saveSettings();
            location.reload();
        }, 1000);
    }

    if (userDevice === "iOS") {
        var checkbox = document.getElementById("fetchSongsSite");
        checkbox.disabled = true;
    }

    document.getElementById("logKeysCheck").checked = miscellaneous.logKeys;
    logKeys = miscellaneous.logKeys;

    document.getElementById("fetchSongsSite").checked = miscellaneous.fetchSongs;
    fetchSongs = miscellaneous.fetchSongs;

    document.getElementById("playSFXcheck").checked = miscellaneous.playSFX;
    playSFX = miscellaneous.playSFX;

    document.getElementById("pulseOnBPMcheck").checked = miscellaneous.pulseOnBPM;
    pulseOnBPM = miscellaneous.pulseOnBPM;

    document.getElementById("extraLogCheck").checked = miscellaneous.extraLog;
    extraLog = miscellaneous.extraLog;

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

    document.getElementById("songTimeoutAfterSongEndNum").value = miscellaneous.songTimeoutDelay;
    songTimeoutDelay = miscellaneous.songTimeoutDelay;

    document.getElementById("readyTimerInput").value = miscellaneous.countdownFrom;
    countdownFrom = miscellaneous.countdownFrom;

    document.getElementById("brightnessInput").value = miscellaneous.BGbrightness;
    BGbrightness = Math.min(miscellaneous.BGbrightness, 1); // Ensure brightness does not exceed 1

    const savedBackgroundOption = savedMiscellaneous.backgroundOption || "defaultBG";
    const savedCustomBackgroundBlur = savedMiscellaneous.customBackgroundBlur || "0px";
    const savedCustomBG = localStorage.getItem("customBackground");

    if (savedBackgroundOption) {
        defaultBackground.value = savedBackgroundOption;
        if (savedBackgroundOption === "customBG" && savedCustomBG) {
            BGurl = savedCustomBG;
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

            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "inline";
            marginCustomBG2.style.display = "inline";
            marginBlur.style.display = "inline";
            marginBlur2.style.display = "inline";
        } else if (selectedOption === "transparentBG") {
            customTransparentBGblur.style.display = "inline";
            backdropBlurInput.style.display = "inline";
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginBlur.style.display = "inline";
            marginBlur2.style.display = "inline";
        } else {
            customBGLabel.style.display = "none";
            customBGInput.style.display = "none";
            customTransparentBGblur.style.display = "none";
            backdropBlurInput.style.display = "none";
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "none";
            marginBlur2.style.display = "none";
        }
    });

    const savedCustomBackground = localStorage.getItem("customBackground");

    switch (savedMiscellaneous.backgroundOption) {
        case "defaultBG":
            BGurl = `url("Resources/defaultBG.png")`;
            backgroundOverlay.style.backdropFilter = "none";
            backgroundIsDefault = true;
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "none";
            marginBlur2.style.display = "none";
            break;
        case "defaultBG2":
            BGurl = `url("Resources/wavyChroma.jpg")`;
            backgroundOverlay.style.backdropFilter = "none";
            backgroundIsDefault = true;
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "none";
            marginBlur2.style.display = "none";
            break;
        case "defaultBG3":
            BGurl = `url("Resources/darkSunset.png")`;
            backgroundOverlay.style.backdropFilter = "none";
            backgroundIsDefault = true;
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "none";
            marginBlur2.style.display = "none";
            break;
        case "defaultBG4":
            BGurl = `url("Resources/blueWave.jpg")`;
            backgroundOverlay.style.backdropFilter = "none";
            backgroundIsDefault = true;
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "none";
            marginBlur2.style.display = "none";
            break;
        case "defaultBG5":
            BGurl = `url("Resources/space.jpeg")`;
            backgroundOverlay.style.backdropFilter = "none";
            backgroundIsDefault = true;
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "none";
            marginBlur2.style.display = "none";
            break;
        case "defaultBG6":
            BGurl = `url("Resources/galaxy.jpg")`;
            backgroundOverlay.style.backdropFilter = "none";
            backgroundIsDefault = true;
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "none";
            marginBlur2.style.display = "none";
            break;
        case "defaultBG7":
            BGurl = `url("Resources/darkerSpace.jpg")`;
            backgroundOverlay.style.backdropFilter = "none";
            backgroundIsDefault = true;
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "none";
            marginBlur2.style.display = "none";
            break;
        case "defaultBG8":
            BGurl = `url("Resources/starSystem.jpg")`;
            backgroundOverlay.style.backdropFilter = "none";
            backgroundIsDefault = true;
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "none";
            marginBlur2.style.display = "none";
            break;
        case "htmlBG":
            BGurl = "none";
            backgroundOverlay.style.backdropFilter = `blur(${savedCustomBackgroundBlur}px)`;
            backgroundIsDefault = true;
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "none";
            marginBlur2.style.display = "none";
            break;
        case "transparentBG":
            BGurl = "none";
            backgroundOverlay.style.backdropFilter = `blur(${savedCustomBackgroundBlur}px)`;
            backgroundIsDefault = false;
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "inline";
            marginBlur2.style.display = "inline";
            break;
        case "customBG":
            if (savedCustomBackground) {
                BGurl = `url("${savedCustomBG}")`;
                backgroundOverlay.style.backdropFilter = `blur(${savedCustomBackgroundBlur}px)`;
            }
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "inline";
            marginCustomBG2.style.display = "inline";
            marginBlur.style.display = "inline";
            marginBlur2.style.display = "inline";
            backgroundIsDefault = true;
            break;
        default:
            BGurl = `url("Resources/defaultBG.png")`;
            backgroundOverlay.style.backdropFilter = "none";
            backgroundIsDefault = true;
            marginSelect.style.display = "inline";
            marginSelect2.style.display = "inline";
            marginCustomBG.style.display = "none";
            marginCustomBG2.style.display = "none";
            marginBlur.style.display = "none";
            marginBlur2.style.display = "none";
    }

    backgroundOverlay.style.filter = `brightness(${BGbrightness})`;

    initializeHitSounds(miscellaneous.hitSound);

    if (savedMiscellaneous.noteStyle === "arrows") {
        switchToArrows();
    } else if (savedMiscellaneous.noteStyle === "circles") {
        switchToCircles();
    }

    console.log("Loaded settings", keybinds, miscellaneous);
}

function getFileDataUrl(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result);
    };
    reader.readAsDataURL(file);
}

function handleFileUpload(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const imageData = e.target.result;

        localStorage.setItem("customBackground", imageData);
        BGurl = `url("${imageData}")`;
    };

    reader.readAsDataURL(file);
}

function saveSettings() {
    let newKeybinds;

    if (userDevice === "Desktop" || userDevice === "Chromebook") {
        newKeybinds = {
            up:
                document
                    .getElementById("up")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            left:
                document
                    .getElementById("left")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            down:
                document
                    .getElementById("down")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            right:
                document
                    .getElementById("right")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            pause:
                document
                    .getElementById("pause")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            autoHit:
                document
                    .getElementById("autoHit")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            previous:
                document
                    .getElementById("previousInput")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            restart:
                document
                    .getElementById("restartInput")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            next:
                document
                    .getElementById("nextInput")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            randomize:
                document
                    .getElementById("randomize")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            toggleNoteStyle:
                document
                    .getElementById("toggleNoteStyleInput")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            fullscreen:
                document
                    .getElementById("fullscreenInput")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            openSongList:
                document
                    .getElementById("openSongL")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || [],
            openSettings:
                document
                    .getElementById("openKeybindsKey")
                    ?.value.split(", ")
                    .map((key) => key.trim()) || []
        };
    }

    const countdownInputValue = document.getElementById("readyTimerInput").value;
    const countdownFromParsed = parseFloat(countdownInputValue, 10); // Use 10 to specify decimal parsing

    const newMiscellaneous = {
        noteStyle: document.getElementById("defaultNoteStyle").value,
        songTimeoutAfterSongEnd: document.getElementById("songTimeoutAfterSongEnd").checked,
        songTimeoutDelay: parseInt(document.getElementById("songTimeoutAfterSongEndNum").value, 10) || defaultMiscellaneous.songTimeoutDelay,
        vinylRotation: document.getElementById("vinylRotation").checked,
        circularImage: document.getElementById("circularImage").checked,
        backgroundOption: document.getElementById("defaultBackground").value,
        customBackgroundBlur: document.getElementById("backdropBlurInput").value,
        logKeys: document.getElementById("logKeysCheck").checked,
        hitSound: document.getElementById("defaultHitSound").value,
        saveSongUsingControllers: document.getElementById("saveRecentSongs").checked,
        fetchSongs: userDevice === "iOS" || document.getElementById("fetchSongsSite").checked,
        playSFX: document.getElementById("playSFXcheck").checked,
        pulseOnBPM: document.getElementById("pulseOnBPMcheck").checked,
        extraLog: document.getElementById("extraLogCheck").checked,
        BGbrightness: parseFloat(document.getElementById("brightnessInput").value) || defaultMiscellaneous.BGbrightness,
        countdownFrom: isNaN(countdownFromParsed) ? defaultMiscellaneous.countdownFrom : countdownFromParsed
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
    playSFX = newMiscellaneous.playSFX;
    pulseOnBPM = newMiscellaneous.pulseOnBPM;
    extraLog = newMiscellaneous.extraLog;

    // Validation and adjustment of newMiscellaneous values
    if (newMiscellaneous.BGbrightness > 1) {
        newMiscellaneous.BGbrightness = 1;
    } else if (newMiscellaneous.BGbrightness < 0) {
        newMiscellaneous.BGbrightness = 0;
    }

    if (newMiscellaneous.countdownFrom < 0) {
        alert("Please enter a non-negative number for the countdown timer.");
        return;
    }

    // Apply the changes to global variables
    countdownFrom = newMiscellaneous.countdownFrom;
    BGbrightness = newMiscellaneous.BGbrightness;

    const timeoutInputValue = newMiscellaneous.songTimeoutDelay;

    if (isNaN(timeoutInputValue)) {
        alert("Please enter a valid number for the timeout delay.");
        return;
    }
    if (timeoutInputValue > 15000) {
        alert("Please enter a number that is below 15,000.");
        return;
    }

    var blurInput = newMiscellaneous.customBackgroundBlur;
    const blurValue = parseInt(blurInput, 10);
    if (blurValue < 0 || blurValue >= 1000) {
        alert("Please enter a number between 0 and 1000 for the blur value. Defaulted to 0.");
        logWarn(`BlurMiss. Input: ${blurInput}, Value: ${blurValue}`);
        blurInput = 0;
    }

    if (isNaN(blurValue)) {
        alert("Please enter a valid number for the blur value. Defaulted to 0.");
        logWarn(`BlurNaN. Input: ${blurInput}, Value: ${blurValue}`);
        blurInput = 0;
    }

    switch (newMiscellaneous.backgroundOption) {
        case "defaultBG":
            BGurl = `url("Resources/defaultBG.png")`;
            backgroundOverlay.style.backdropFilter = "none";
            break;
        case "defaultBG2":
            BGurl = `url("Resources/wavyChroma.jpg")`;
            backgroundOverlay.style.backdropFilter = "none";
            break;
        case "defaultBG3":
            BGurl = `url("Resources/darkSunset.png")`;
            backgroundOverlay.style.backdropFilter = "none";
            break;
        case "defaultBG4":
            BGurl = `url("Resources/blueWave.jpg")`;
            backgroundOverlay.style.backdropFilter = "none";
            break;
        case "defaultBG5":
            BGurl = `url("Resources/space.jpeg")`;
            backgroundOverlay.style.backdropFilter = "none";
            break;
        case "defaultBG6":
            BGurl = `url("Resources/galaxy.jpg")`;
            backgroundOverlay.style.backdropFilter = "none";
            break;
        case "defaultBG7":
            BGurl = `url("Resources/darkerSpace.jpg")`;
            backgroundOverlay.style.backdropFilter = "none";
            break;
        case "defaultBG8":
            BGurl = `url("Resources/starSystem.jpg")`;
            backgroundOverlay.style.backdropFilter = "none";
            break;
        case "htmlBG":
            BGurl = `url("Resources/BackgroundHtml2.png")`;
            backgroundOverlay.style.backdropFilter = "none";
            break;
        case "transparentBG":
            BGurl = "none";
            backgroundOverlay.style.backdropFilter = `blur(${newMiscellaneous.customBackgroundBlur}px)`;
            break;
        case "customBG":
            const file = document.getElementById("customBGInput").files[0];
            if (file) {
                handleFileUpload(file);
            }
            break;
        default:
            BGurl = `url("Resources/defaultBG.png")`;
            backgroundOverlay.style.backdropFilter = "none";
    }

    backgroundOverlay.style.filter = `brightness(${newMiscellaneous.BGbrightness})`;

    if (newMiscellaneous.noteStyle === "arrows") {
        switchToArrows();
    } else if (newMiscellaneous.noteStyle === "circles") {
        switchToCircles();
    }

    if (userDevice === "Desktop" || userDevice === "Chromebook") {
        localStorage.setItem("keybinds", JSON.stringify(newKeybinds));
    }
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

function updateKeybindsFields() {
    if (userDevice === "Desktop" || userDevice === "Chromebook") {
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
        document.getElementById("openSongL").value = keybinds.openSongList.join(", ");
        document.getElementById("openKeybindsKey").value = keybinds.openSettings.join(", ");
    }

    document.getElementById("defaultNoteStyle").value = miscellaneous.noteStyle;
    document.getElementById("defaultHitSound").value = miscellaneous.hitSound;
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
    console.log("Saving to history...");

    keybindsHistory = keybindsHistory.slice(0, keybindsIndex + 1);
    miscellaneousHistory = miscellaneousHistory.slice(0, keybindsIndex + 1);

    console.log("Current Keybinds:", keybinds);
    console.log("Current Miscellaneous:", miscellaneous);

    keybindsHistory.push(JSON.stringify(keybinds));
    miscellaneousHistory.push(JSON.stringify(miscellaneous));

    keybindsIndex++;

    console.log("History saved. Current keybinds history:");
    console.log(keybindsHistory.map((item) => JSON.parse(item))); // Parse JSON for readability
    console.log("Current miscellaneous history:");
    console.log(miscellaneousHistory.map((item) => JSON.parse(item))); // Parse JSON for readability
    console.log("Current history index:", keybindsIndex);
}

// Undo keybinds and miscellaneous settings
function undoKeybinds() {
    if (keybindsIndex > 0) {
        console.log("Undoing changes...");

        keybindsIndex--;
        keybinds = JSON.parse(keybindsHistory[keybindsIndex]);
        miscellaneous = JSON.parse(miscellaneousHistory[keybindsIndex]);

        console.log("Restored Keybinds:", keybinds);
        console.log("Restored Miscellaneous:", miscellaneous);

        updateKeybindsFields();
        console.log("Undo successful. Current history index:", keybindsIndex);
    } else {
        console.log("No more undo steps available. Index", keybindsIndex);
    }
}

// Redo keybinds and miscellaneous settings
function redoKeybinds() {
    if (keybindsIndex < keybindsHistory.length - 1) {
        console.log("Redoing changes...");

        keybindsIndex++;
        keybinds = JSON.parse(keybindsHistory[keybindsIndex]);
        miscellaneous = JSON.parse(miscellaneousHistory[keybindsIndex]);

        console.log("Restored Keybinds:", keybinds);
        console.log("Restored Miscellaneous:", miscellaneous);

        updateKeybindsFields();
        console.log("Redo successful. Current history index:", keybindsIndex);
    } else {
        console.log("No more redo steps available. Index", keybindsIndex);
    }
}

function initializeEventListeners() {
    if (userDevice === "Desktop" || userDevice === "Chromebook") {
        document.getElementById("up").addEventListener("change", () => {
            console.log("Change detected in 'up' input.");
            saveToHistory();
        });
        document.getElementById("left").addEventListener("change", () => {
            console.log("Change detected in 'left' input.");
            saveToHistory();
        });
        document.getElementById("down").addEventListener("change", () => {
            console.log("Change detected in 'down' input.");
            saveToHistory();
        });
        document.getElementById("right").addEventListener("change", () => {
            console.log("Change detected in 'right' input.");
            saveToHistory();
        });
        document.getElementById("pause").addEventListener("change", () => {
            console.log("Change detected in 'pause' input.");
            saveToHistory();
        });
        document.getElementById("autoHit").addEventListener("change", () => {
            console.log("Change detected in 'autoHit' input.");
            saveToHistory();
        });
        document.getElementById("fullscreenInput").addEventListener("change", () => {
            console.log("Change detected in 'fullscreenInput' input.");
            saveToHistory();
        });
        document.getElementById("previousInput").addEventListener("change", () => {
            console.log("Change detected in 'previousInput' input.");
            saveToHistory();
        });
        document.getElementById("restartInput").addEventListener("change", () => {
            console.log("Change detected in 'restartInput' input.");
            saveToHistory();
        });
        document.getElementById("nextInput").addEventListener("change", () => {
            console.log("Change detected in 'nextInput' input.");
            saveToHistory();
        });
        document.getElementById("randomize").addEventListener("change", () => {
            console.log("Change detected in 'randomize' input.");
            saveToHistory();
        });
        document.getElementById("toggleNoteStyleInput").addEventListener("change", () => {
            console.log("Change detected in 'toggleNoteStyleInput' input.");
            saveToHistory();
        });
        document.getElementById("openSongL").addEventListener("change", () => {
            console.log("Change detected in 'openSongList' input.");
            saveToHistory();
        });
        document.getElementById("openKeybindsKey").addEventListener("change", () => {
            console.log("Change detected in 'openSettings' input.");
            saveToHistory();
        });
    }
    document.getElementById("defaultNoteStyle").addEventListener("change", () => {
        console.log("Change detected in 'defaultNoteStyle' select.");
        saveToHistory();
    });
    document.getElementById("defaultHitSound").addEventListener("change", function (event) {
        console.log("Change detected in 'defaultHitSound' select.");
        miscellaneous.hitSound = event.target.value; // Update the miscellaneous object
        saveToHistory();
    });
    document.getElementById("logKeysCheck").addEventListener("change", () => {
        console.log("Change detected in 'logKeysCheck' checkbox.");
        saveToHistory();
    });
    document.getElementById("saveRecentSongs").addEventListener("change", () => {
        console.log("Change detected in 'saveRecentSongs' checkbox.");
        saveToHistory();
    });
    document.getElementById("songTimeoutAfterSongEnd").addEventListener("change", () => {
        console.log("Change detected in 'songTimeoutAfterSongEnd' checkbox.");
        saveToHistory();
    });
    document.getElementById("songTimeoutAfterSongEndNum").addEventListener("change", () => {
        console.log("Change detected in 'songTimeoutAfterSongEndNum' input.");
        saveToHistory();
    });
    document.getElementById("circularImage").addEventListener("change", () => {
        console.log("Change detected in 'circularImage' checkbox.");
        saveToHistory();
    });
    document.getElementById("vinylRotation").addEventListener("change", () => {
        console.log("Change detected in 'vinylRotation' checkbox.");
        saveToHistory();
    });
    document.getElementById("defaultBackground").addEventListener("change", () => {
        console.log("Change detected in 'defaultBackground' select.");
        saveToHistory();
    });
    document.getElementById("customBGInput").addEventListener("change", () => {
        console.log("Change detected in 'customBGInput' file input.");
        saveToHistory();
    });
    document.getElementById("backdropBlurInput").addEventListener("change", () => {
        console.log("Change detected in 'backdropBlurInput' number input.");
        saveToHistory();
    });
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
        if (keyDown === "ENTER") {
            document.getElementById("startButton").click();
            gameStarted = true;
        }
    }

    if (gameStarted && keyDown === "ENTER") {
        return;
    }

    // Prevent further actions if a modal is open
    if (
        settingsModal.style.display === "block" ||
        settingPresets.style.display === "block" ||
        songListModal.style.display === "block" ||
        selectedSongModal.style.display === "block"
    ) {
        if (keyDown === "ESCAPE") {
            if (settingsModal.style.display === "block") {
                closeModal();
                playSoundEffect("Resources/SFX/clickBtn2.mp3", 0.7);
                console.log("Escape key pressed. Modal closed.");
            } else if (settingPresets.style.display === "block") {
                closePresets();
                playSoundEffect("Resources/SFX/clickBtn2.mp3", 0.7);
                console.log("Escape key pressed. Setting presets closed.");
            } else if (songListModal.style.display === "block") {
                if (searchInput.value !== "") {
                    searchInput.value = "";
                    filterSongs();
                    console.log("Escape key pressed. Search input cleared.");
                } else {
                    closeSongList();
                    playSoundEffect("Resources/SFX/clickBtn2.mp3", 0.7);
                    console.log("Escape key pressed. Song list closed.");
                }
            } else if (selectedSongModal.style.display === "block") {
                closeSelectedSongModal();
                playSoundEffect("Resources/SFX/clickBtn2.mp3", 0.7);
                console.log("Escape key pressed. Song modal closed.");
            }
        }
    }

    // Open settings modal if the corresponding key is pressed
    if (keybinds.openSettings.includes(keyDown)) {
        openModal();
        playSoundEffect("Resources/SFX/clickBtn.mp3", 1);
        console.log(`${keybinds.openSettings} key pressed. Modal opened.`);
        return; // Prevent further actions
    }

    // Open song list modal if the corresponding key is pressed
    if (keybinds.openSongList.includes(keyDown)) {
        openSongList();
        playSoundEffect("Resources/SFX/clickBtn.mp3", 1);
        console.log(`${keybinds.openSongList} key pressed. Song list opened.`);
        return; // Prevent further actions
    }

    if (gameStarted) {
        // Handle directional keys and other game controls after game has started
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
        if (keyboardEvent.shiftKey && keybinds.previous.includes(keyDown)) {
            skipToFirstSong();
        } else if (keybinds.previous.includes(keyDown)) {
            previousSong();
        }
        if (keybinds.restart.includes(keyDown)) {
            restartSong();
        }
        if (keyboardEvent.shiftKey && keybinds.next.includes(keyDown)) {
            skipToLastSong();
        } else if (keybinds.next.includes(keyDown)) {
            nextSong();
        }
        if (keybinds.randomize.includes(keyDown)) {
            randomizeSong();
        }
        if (keybinds.toggleNoteStyle.includes(keyDown)) {
            toggleNoteStyle();
        }
    }

    // Debug and developer shortcuts
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

// - . / .- -- --- / .- -. --. .  /.--. . .-. --- / - ..- / -. --- / .-.. --- / ... .- -... . ... / -.-- / -. --- / ... . / --.- ..- . / .... .- -.-. . .-.

// Thanks for playing Beatz!
// - GuayabR.
