/**
 * Title: Beatz's Initialization
 * Author: Victor//GuayabR
 * Date: 25/08/2024
 * Version: MOBILE 4.3.3 test (release.version.subversion.bugfix)
 * GitHub Repository: https://github.com/GuayabR/Beatz
 **/

// RELEASE NOTES

let popupDisplayed = false;

let changelogPopupDisplayed = false;

async function checkForNewRelease(currentVersion) {
    const repoOwner = "GuayabR";
    const repoName = "Beatz";
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

    try {
        const response = await fetch(apiUrl);
        const release = await response.json();
        const latestVersion = release.tag_name;
        const releaseNotes = release.body; // Release notes

        if (latestVersion !== currentVersion) {
            // A new release is detected
            displayNewReleasePopup(releaseNotes, latestVersion, true);
        }
    } catch (error) {
        logError("Error fetching release information:", error);
    }
}

async function fetchVersionNotes(version) {
    const rawFileUrl = "https://raw.githubusercontent.com/GuayabR/Beatz/main/versions.txt"; // Direct link to the raw versions.txt file

    try {
        const response = await fetch(rawFileUrl);
        const text = await response.text();

        // Parse the text file to find the specific version notes
        const regex = new RegExp(`^${version}:\\s*([\\s\\S]*?)(?=^\\d+:|\\Z)`, "m");
        const match = text.match(regex);

        return match ? match[1].trim() : "No notes available for this version.";
    } catch (error) {
        logError("Error fetching version notes:", error);
        return "Error fetching version notes.";
    }
}

function displayNewReleasePopup(releaseNotes, version, saveVer) {
    console.log("Displaying release popup with version:", version, "Save to localStorage:", saveVer);

    // Get values from localStorage
    const newPlayer = localStorage.getItem("isNewPlayer");
    const storedVersion = localStorage.getItem("popUpDisplayed");

    // Check conditions to display popup
    if (!saveVer || (!newPlayer && (storedVersion === null || storedVersion !== version))) {
        popupDisplayed = true;

        // Create a popup container
        const popup = document.createElement("div");
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%) scale(0)"; // Start with scale(0) for the animation
        popup.style.padding = "20px";
        popup.style.background = "transparent";
        popup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        popup.style.backdropFilter = "blur(10px)";
        popup.style.borderRadius = "10px";
        popup.style.border = "2px solid #fff";
        popup.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";
        popup.style.zIndex = "1000";

        if (!isMobile) {
            popup.style.maxHeight = "80vh"; // Limit the height of the popup
            popup.style.width = "50vh";
        } else {
            popup.style.maxHeight = "60vh"; // Limit the height of the popup
            popup.style.width = "60%";
        }
        popup.style.overflow = "hidden"; // Hide overflow
        popup.style.transition = "transform 0.3s cubic-bezier(0.17, 0.71, 0.51, 0.94)"; // Custom cubic-bezier for scaling in

        var title;

        // Create a title for the popup
        if (!isMobile) {
            title = document.createElement("h2");
        } else {
            title = document.createElement("h3");
        }

        title.innerHTML = `New Version Available!<br>${version}`;
        popup.appendChild(title);

        // Create a content container for the release notes
        const contentContainer = document.createElement("div");
        contentContainer.style.maxHeight = "60vh"; // Limit the height of the content area
        contentContainer.style.overflowY = "auto"; // Enable vertical scrolling
        contentContainer.style.overflowX = "hidden"; // Prevent horizontal scrolling
        contentContainer.style.overflowWrap = "break-word"; // Ensure long words break to avoid overflow

        const content = document.createElement("p");
        content.style.whiteSpace = "pre-wrap"; // To maintain newlines in release notes
        content.innerText = releaseNotes;

        if (isMobile) {
            content.style.fontSize = "13px";
        }

        contentContainer.appendChild(content);
        popup.appendChild(contentContainer);

        // Create a button to close the popup
        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";

        if (isMobile) {
            closeButton.style.opacity = "0";
            closeButton.style.transition = "opacity 0.4s ease-in";
            closeButton.style.padding = "5px 10px";
        }

        closeButton.onclick = () => {
            // Animate scale back to 0 for closing
            popup.style.transition = "transform 0.2s ease-in-out"; // Ease-in-out for scaling out
            popup.style.transform = "translate(-50%, -50%) scale(0)";

            if (isMobile) {
                // Fade out buttons after closing pop up, only on mobile devices
                setTimeout(() => {
                    closeButton.style.opacity = "0";
                    changelogButton.style.opacity = "0";
                }, 10);
            }

            // Remove the popup after the animation duration
            setTimeout(() => {
                document.body.removeChild(popup);
                popupDisplayed = false;

                if (isMobile) {
                    if (document.body.contains(closeButton)) {
                        document.body.removeChild(closeButton);
                    }
                    if (document.body.contains(changelogButton)) {
                        document.body.removeChild(changelogButton);
                    }
                }
            }, 500);
        };
        popup.appendChild(closeButton);

        // Create a button to show the full changelog
        const changelogButton = document.createElement("button");
        changelogButton.innerText = "View Full Changelog";

        if (isMobile) {
            changelogButton.style.opacity = "0";
            changelogButton.style.transition = "opacity 0.4s ease-in";
            changelogButton.style.padding = "5px 10px";

            // Fade in buttons after adding them back
            setTimeout(() => {
                closeButton.style.opacity = "1";
                changelogButton.style.opacity = "1";
            }, 10);
        }

        changelogButton.onclick = () => {
            changelogButton.innerText = "Loading...";

            if (changelogPopupDisplayed) {
                changelogButton.innerText = "View Full Changelog";
                console.log("Changelog pop up is already displayed.");
            }

            if (!changelogPopupDisplayed) {
                fetch("https://guayabr.github.io/Beatz/versions.txt")
                    .then((response) => response.text())
                    .then((data) => {
                        changelogPopupDisplayed = true;

                        // Fade out buttons if on mobile
                        if (isMobile) {
                            closeButton.style.transition = "opacity 0.5s ease-out";
                            changelogButton.style.transition = "opacity 0.5s ease-out";
                            closeButton.style.opacity = "0";
                            changelogButton.style.opacity = "0";

                            // Remove buttons after fade out
                            setTimeout(() => {
                                if (popup.contains(closeButton)) {
                                    popup.removeChild(closeButton);
                                }
                                if (popup.contains(changelogButton)) {
                                    popup.removeChild(changelogButton);
                                }
                            }, 500);
                        }

                        // Display the full changelog in a new popup
                        const changelogPopup = document.createElement("div");
                        changelogPopup.style.position = "fixed";
                        changelogPopup.style.top = "50%";
                        changelogPopup.style.left = "50%";
                        changelogPopup.style.transform = "translate(-50%, -50%) scale(0)"; // Start with scale(0) for the animation
                        changelogPopup.style.padding = "20px";
                        changelogPopup.style.background = "transparent";
                        changelogPopup.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // Darker background for better readability
                        changelogPopup.style.backdropFilter = "blur(10px)";
                        changelogPopup.style.borderRadius = "10px";
                        changelogPopup.style.border = "2px solid #fff";
                        changelogPopup.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";
                        changelogPopup.style.zIndex = "1000";

                        if (isMobile) {
                            changelogPopup.style.width = "60%";
                            changelogPopup.style.fontSize = "13px";
                        } else {
                            changelogPopup.style.width = "60vh";
                        }

                        changelogPopup.style.height = "80vh";
                        changelogPopup.style.overflowY = "auto"; // Enable vertical scrolling
                        changelogPopup.style.transition = "transform 0.3s cubic-bezier(0.17, 0.71, 0.51, 0.94)"; // Custom cubic-bezier for scaling in

                        const changelogTitle = document.createElement("h2");
                        changelogTitle.innerText = "Full Changelog";
                        changelogPopup.appendChild(changelogTitle);

                        const changelogContent = document.createElement("p");
                        changelogContent.style.whiteSpace = "pre-wrap"; // To maintain newlines in changelog
                        changelogContent.innerText = data;
                        changelogPopup.appendChild(changelogContent);

                        // Create a fixed close button outside the changelog popup
                        const changelogCloseButton = document.createElement("button");
                        changelogCloseButton.innerText = "Close";
                        changelogCloseButton.style.position = "fixed";
                        changelogCloseButton.style.bottom = "10px";
                        changelogCloseButton.style.left = "50%";
                        changelogCloseButton.style.transform = "translateX(-50%)";
                        changelogCloseButton.style.zIndex = "1001"; // Ensure it is above other content
                        changelogCloseButton.style.opacity = "0";
                        changelogCloseButton.style.transition = "opacity 0.3s ease"; // Smooth transition for visibility

                        // Fade in buttons after adding them back
                        setTimeout(() => {
                            changelogCloseButton.style.opacity = "1";
                        }, 10);

                        if (isMobile) {
                            changelogCloseButton.style.padding = "5px 12px";
                        }

                        changelogCloseButton.onclick = () => {
                            // Animate scale back to 0 for closing
                            changelogPopup.style.transition = "transform 0.5s ease-in-out"; // Ease-in-out for scaling out
                            changelogPopup.style.transform = "translate(-50%, -50%) scale(0)";

                            // Animate the close button fade out
                            changelogCloseButton.style.opacity = "0";

                            // Remove the popup and button after the animation duration
                            setTimeout(() => {
                                document.body.removeChild(changelogPopup);
                                document.body.removeChild(changelogCloseButton);

                                changelogPopupDisplayed = false;

                                // Fade in buttons and re-append after changelog popup is closed
                                if (isMobile) {
                                    closeButton.style.opacity = "0";
                                    changelogButton.style.opacity = "0";
                                    document.body.appendChild(closeButton);
                                    document.body.appendChild(changelogButton);

                                    // Fade in buttons after adding them back
                                    setTimeout(() => {
                                        closeButton.style.transition = "opacity 0.5s ease-in";
                                        changelogButton.style.transition = "opacity 0.5s ease-in";
                                        closeButton.style.opacity = "1";
                                        changelogButton.style.opacity = "1";
                                    }, 10);
                                }
                            }, 500);
                        };

                        // Append the close button to the body
                        document.body.appendChild(changelogCloseButton);

                        document.body.appendChild(changelogPopup);

                        // Trigger the scaling in animation for changelog popup
                        setTimeout(() => {
                            changelogPopup.style.transform = "translate(-50%, -50%) scale(1)";
                        }, 10);
                        // Reset button text after loading
                        changelogButton.innerText = "View Full Changelog";
                    })
                    .catch((error) => {
                        console.error("Error fetching changelog:", error.message);

                        // Set button text to indicate error
                        changelogButton.innerText = "Error: failed to fetch changelog";

                        // Optionally, reset the button text after a few seconds
                        setTimeout(() => {
                            changelogButton.innerText = "View Full Changelog";
                        }, 3000); // Reset after 3 seconds
                    });
            }
        };
        popup.appendChild(changelogButton);

        // Append the popup to the body
        document.body.appendChild(popup);

        // Append buttons based on device type
        if (isMobile) {
            // Append buttons to the document body and style them as fixed below the popup
            document.body.appendChild(closeButton);
            document.body.appendChild(changelogButton);

            // Style for the close button
            closeButton.style.position = "fixed";
            closeButton.style.bottom = "5px"; // Distance from the bottom of the viewport
            closeButton.style.left = "50%"; // Center horizontally
            closeButton.style.transform = "translateX(-50%)"; // Center the button horizontally
            closeButton.style.zIndex = "1001"; // Ensure it's above the popup

            // Style for the changelog button
            changelogButton.style.position = "fixed";
            changelogButton.style.bottom = "45px"; // Distance from the bottom of the viewport
            changelogButton.style.left = "50%"; // Center horizontally
            changelogButton.style.transform = "translateX(-50%)"; // Center the button horizontally
            changelogButton.style.zIndex = "1001"; // Ensure it's above the popup
        } else {
            // Append buttons to the popup for non-mobile devices
            popup.appendChild(closeButton);
            popup.appendChild(changelogButton);
        }

        // Trigger the scaling in animation after appending to the body
        setTimeout(() => {
            popup.style.transform = "translate(-50%, -50%) scale(1)"; // Scale up to full size
        }, 10); // Small timeout to allow the DOM to recognize the initial scale(0) state

        if (saveVer) {
            localStorage.setItem("popUpDisplayed", version);
            console.log("Version saved to localStorage.");
        } else {
            logNotice("Debug: Release notes pop-up displayed without saving version to localStorage.");
        }
    } else {
        console.log("Conditions not met, popup not displayed.");
    }
}

// Add the event listener for debug keybinds
document.addEventListener("keydown", async (event) => {
    if (event.ctrlKey && event.key === ",") {
        if (popupDisplayed) {
            return;
        }
        console.log("Debug mode activated: Ctrl + , key pressed.");
        await debugCheckForNewRelease();
    }
});

async function debugCheckForNewRelease() {
    const repoOwner = "GuayabR";
    const repoName = "Beatz";
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

    try {
        const response = await fetch(apiUrl);
        const release = await response.json();
        const latestVersion = release.tag_name;
        const releaseNotes = release.body; // Release notes

        // Force display the popup for debugging purposes
        displayNewReleasePopup(releaseNotes, latestVersion, false); // 'false' to prevent saving to localStorage
    } catch (error) {
        logError("Error fetching release information:", error);
    }
}

// ERROR LOGGING

// Array to store errors
const errorArray = ["No errors."];

const noticeArray = ["No notices."];

// Global error handler
window.addEventListener("error", function (event) {
    let message = event.message || "Unknown error";
    if (event.filename) {
        message += ` at ${event.filename}:${event.lineno}:${event.colno}`;
    }
    logError(message);
});

// Global unhandled promise rejection handler
window.addEventListener("unhandledrejection", function (event) {
    logError(`Unhandled promise rejection: ${event.reason} | ${event.message}`);
});

// Function to dynamically create and display log messages as clickable links if URLs are present
function logMessage(message, type = "error", color = "red", timeout = 7500) {
    const errorContainer = document.getElementById("errorContainer");
    const errorDiv = document.createElement("div");
    errorDiv.className = "errorLogging";

    // Function to convert URLs in text to clickable links
    const convertUrlsToLinks = (text) => {
        const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
        return text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    };

    // Convert message text to include clickable links
    const formattedMessage = convertUrlsToLinks(message);

    const noErrorsIndex = errorArray.indexOf("No errors.");

    // Set the text and color based on the message type
    switch (type) {
        case "error":
            errorDiv.innerHTML = `Error: ${formattedMessage}`; // Use innerHTML to allow clickable links
            errorDiv.style.backgroundColor = "red";
            // Check if 'No errors.' is in the array, if so, remove it
            if (noErrorsIndex !== -1) {
                errorArray.splice(noErrorsIndex, 1);
            }
            errorArray.push(message);
            console.error(message);
            break;
        case "warn":
            errorDiv.innerHTML = `Warning: ${formattedMessage}`; // Use innerHTML to allow clickable links
            errorDiv.style.backgroundColor = "rgb(255, 100, 0)";
            // Check if 'No errors.' is in the array, if so, remove it
            if (noErrorsIndex !== -1) {
                errorArray.splice(noErrorsIndex, 1);
            }
            errorArray.push(message);
            console.warn(message);
            break;
        case "notice":
            errorDiv.innerHTML = `Notice: ${formattedMessage}`; // Use innerHTML to allow clickable links
            errorDiv.style.backgroundColor = color;
            // Check if 'No errors.' is in the array, if so, remove it
            const noNoticesIndex = noticeArray.indexOf("No notices.");
            if (noNoticesIndex !== -1) {
                noticeArray.splice(noNoticesIndex, 1);
            }
            noticeArray.push(message);
            console.log(message);
            break;
    }

    // Append the new error div to the container
    errorContainer.appendChild(errorDiv);

    // Display the error div with fade-in animation
    errorDiv.style.display = "block";

    // Automatically trigger the fade-out animation, then remove the element
    setTimeout(() => {
        // Trigger the fade-out animation
        errorDiv.style.animation = "fadeout 0.5s forwards";

        // Wait for the animation to finish before removing the element
        errorDiv.addEventListener("animationend", () => {
            errorDiv.remove();
        });
    }, timeout);
}

// Log error function
function logError(message, timeout) {
    const err = message || "Unspecified error.";
    logMessage(err, "error", "red", timeout);
}

// Log warning function
function logWarn(message, timeout) {
    const warn = message || "Unspecified warning.";
    logMessage(warn, "warn", "rgb(255, 100, 0)", timeout);
}

// Log notice function
function logNotice(message, color, timeout) {
    const noti = message || "Unspecified notice.";
    const BGcol = color || "rgb(49, 0, 128)";
    logMessage(noti, "notice", BGcol, timeout);
}

// Resource-specific error handling for audio and images
function handleResourceError(element) {
    element.addEventListener("error", function (event) {
        logError(`Failed to load resource: ${event.target.src}`);
    });
}

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

    setTimeout(resizeCanvas, 500);
}

function detectAndHandleDevice() {
    const pauseButton = document.getElementById("togglePauseMBL");
    const pauseMargin = document.getElementById("pauseMargin");
    const pauseMargin2 = document.getElementById("pauseMargin2");

    if (userDevice === "Mobile" || userDevice === "iOS" || userDevice === "Android") {
        logNotice("Beatz! Mobile activated.", "", 2000);
        handleChange();
        setupMobileEventListeners();
        changeStylesheet("mobileStyles.css");

        if (userDevice === "iOS") {
            logNotice("You're using an iOS device, songs are being fetched from guayabr.github.io.", "orange", 3500);
        }
    } else if (userDevice === "Chromebook") {
        logWarn("Chromebook detected. Game might have reduced framerates.");
        document.getElementById("orientationMessage").style.display = "none";
        if (pauseButton) {
            pauseButton.remove();
            pauseMargin.remove();
            pauseMargin2.remove();
        }

        // Set zoom level to 75% for Chromebooks
        document.body.style.transform = "scale(0.85)"; // Scale down to 75%
        document.body.style.transformOrigin = "center"; // Ensure scaling starts from the top-left corner
    } else if (userDevice === "Desktop") {
        console.log("Desktop device is supported. Enjoy Beatz!");
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

// - . / .- -- --- / .- -. --. .  /.--. . .-. --- / - ..- / -. --- / .-.. --- / ... .- -... . ... / -.-- / -. --- / ... . / --.- ..- . / .... .- -.-. . .-.

// Thanks for playing Beatz!
// - GuayabR.
