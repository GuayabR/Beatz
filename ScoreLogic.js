// Leaderboard logic for Beatz!

// Function to load leaderboard
async function loadLeaderboard(song) {
    const response = await fetch(`/leaderboard/${song}`);
    const leaderboard = await response.json();
    const leaderboardDiv = document.getElementById('leaderboard');
    leaderboardDiv.innerHTML = '<h3>Leaderboard</h3>';
    leaderboard.forEach(entry => {
        leaderboardDiv.innerHTML += `<p>${entry.username}: ${entry.score}</p>`;
    });
}

// Function to save score
async function saveScore(song, score) {
    const token = localStorage.getItem('token');
    const response = await fetch('/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, song, score })
    });

    if (response.ok) {
        alert('Score saved');
        loadLeaderboard(song);
    } else {
        alert('Failed to save score');
    }
}