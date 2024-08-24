async function checkForNewRelease(currentVersion) {
    const repoOwner = "GuayabR";
    const repoName = "Beatz";
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

    try {
        const response = await fetch(apiUrl);
        const release = await response.json();
        const latestVersion = release.tag_name; // Assuming version is stored in tag_name
        const releaseNotes = release.body; // Release notes

        if (latestVersion !== currentVersion) {
            // A new release is detected
            displayNewReleasePopup(releaseNotes, latestVersion);
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

function displayNewReleasePopup(releaseNotes, version) {
    // Get values from localStorage
    const newPlayer = localStorage.getItem("isNewPlayer");
    const storedVersion = localStorage.getItem("popUpDisplayed");

    // Check conditions to display popup
    if (!newPlayer && (storedVersion === null || storedVersion !== version)) {
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
        popup.style.width = "50vh";
        popup.style.transition = "transform 0.3s cubic-bezier(0.17, 0.71, 0.51, 0.94)"; // Custom cubic-bezier for scaling in

        // Create a title for the popup
        const title = document.createElement("h2");
        title.innerHTML = `New Version Available!<br>${version}`;
        popup.appendChild(title);

        // Create a content container for the release notes
        const content = document.createElement("p");
        content.style.whiteSpace = "pre-wrap"; // To maintain newlines in release notes
        content.innerText = releaseNotes;
        popup.appendChild(content);

        // Create a button to close the popup
        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.onclick = () => {
            // Animate scale back to 0 for closing
            popup.style.transition = "transform 0.2s ease-in-out"; // Ease-in-out for scaling out
            popup.style.transform = "translate(-50%, -50%) scale(0)";

            // Remove the popup after the animation duration
            setTimeout(() => {
                document.body.removeChild(popup);
                popupDisplayed = false;
            }, 500);
        };
        popup.appendChild(closeButton);

        // Create a button to show the full changelog
        const changelogButton = document.createElement("button");
        changelogButton.innerText = "View Full Changelog";
        changelogButton.onclick = () => {
            fetch("https://guayabr.github.io/Beatz/versions.txt")
                .then((response) => response.text())
                .then((data) => {
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
                    changelogPopup.style.width = "60vh";
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

                    const changelogCloseButton = document.createElement("button");
                    changelogCloseButton.innerText = "Close";
                    changelogCloseButton.style.position = "absolute";
                    changelogCloseButton.style.bottom = "10px";
                    changelogCloseButton.style.left = "50%";
                    changelogCloseButton.style.transform = "translateX(-50%)";
                    changelogCloseButton.onclick = () => {
                        // Animate scale back to 0 for closing
                        changelogPopup.style.transition = "transform 0.5s ease-in-out"; // Ease-in-out for scaling out
                        changelogPopup.style.transform = "translate(-50%, -50%) scale(0)";

                        // Remove the popup after the animation duration
                        setTimeout(() => document.body.removeChild(changelogPopup), 500);
                    };
                    changelogPopup.appendChild(changelogCloseButton);

                    document.body.appendChild(changelogPopup);

                    // Trigger the scaling in animation for changelog popup
                    setTimeout(() => {
                        changelogPopup.style.transform = "translate(-50%, -50%) scale(1)";
                    }, 10);
                })
                .catch((error) => {
                    console.error("Error fetching changelog:", error);
                });
        };
        popup.appendChild(changelogButton);

        // Append the popup to the body
        document.body.appendChild(popup);

        // Trigger the scaling in animation after appending to the body
        setTimeout(() => {
            popup.style.transform = "translate(-50%, -50%) scale(1)"; // Scale up to full size
        }, 10); // Small timeout to allow the DOM to recognize the initial scale(0) state

        // Store the displayed version in localStorage
        localStorage.setItem("popUpDisplayed", version);
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

// Function to dynamically create and display error log divs
function logMessage(message, type = "error", color = "red", timeout = 7500) {
    const errorContainer = document.getElementById("errorContainer");
    const errorDiv = document.createElement("div");
    errorDiv.className = "errorLogging";

    const noErrorsIndex = errorArray.indexOf("No errors.");

    // Set the text and color based on the message type
    switch (type) {
        case "error":
            errorDiv.textContent = `Error: ${message}`;
            errorDiv.style.backgroundColor = "red";
            errorArray.push(message);
            console.error(message);
            // Check if 'No errors.' is in the array, if so, remove it
            if (noErrorsIndex !== -1) {
                errorArray.splice(noErrorsIndex, 1);
            }
            break;
        case "warn":
            errorDiv.textContent = `Warning: ${message}`;
            errorDiv.style.backgroundColor = "rgb(255, 100, 0)";
            errorArray.push(message);
            console.warn(message);
            // Check if 'No errors.' is in the array, if so, remove it
            if (noErrorsIndex !== -1) {
                errorArray.splice(noErrorsIndex, 1);
            }
            break;
        case "notice":
            errorDiv.textContent = `Notice: ${message}`;
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
        logNotice("Beatz! Mobile activated.", "", 3000);
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
