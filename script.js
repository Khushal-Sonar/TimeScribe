// --- Stopwatch Elements ---
const swDisplay = document.getElementById('stopwatch-display');
const swStartBtn = document.getElementById('sw-start');
const swStopBtn = document.getElementById('sw-stop');
const swResetBtn = document.getElementById('sw-reset');

let swStartTime;
let swInterval;
let swTimeElapsed = 0;
let swRunning = false;

// --- Timer Elements ---
const tDisplay = document.getElementById('timer-display');
const tHoursInput = document.getElementById('t-hours');
const tMinutesInput = document.getElementById('t-minutes');
const tSecondsInput = document.getElementById('t-seconds');
const tStartBtn = document.getElementById('t-start');
const tPauseBtn = document.getElementById('t-pause');
const tResetBtn = document.getElementById('t-reset');

let tInterval;
let tTimeRemaining = 0; // in seconds
let tRunning = false;

// --- History Element ---
const historyList = document.getElementById('history-list');

// --- Stopwatch Logic ---

function formatStopwatchTime(time) {
    const date = new Date(time);
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
}

function updateStopwatch() {
    const currentTime = Date.now();
    swTimeElapsed = currentTime - swStartTime;
    swDisplay.textContent = formatStopwatchTime(swTimeElapsed);
}

swStartBtn.onclick = () => {
    if (swRunning) return;
    swRunning = true;
    swStartTime = Date.now() - swTimeElapsed; // Resume from where it left off
    swInterval = setInterval(updateStopwatch, 10); // Update every 10ms
};

swStopBtn.onclick = () => {
    if (!swRunning) return;
    swRunning = false;
    clearInterval(swInterval);
    // When stopped, log the time
    logActivity("Stopwatch", formatStopwatchTime(swTimeElapsed));
};

swResetBtn.onclick = () => {
    swRunning = false;
    clearInterval(swInterval);
    swTimeElapsed = 0;
    swDisplay.textContent = "00:00:00.000";
};

// --- Timer Logic ---

function formatTimerTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateTimer() {
    if (tTimeRemaining <= 0) {
        clearInterval(tInterval);
        tDisplay.textContent = "Time's Up!";
        tRunning = false;
        logActivity("Timer", "Completed");
        // Optionally play a sound
        // new Audio('alarm.mp3').play();
        return;
    }
    tTimeRemaining--;
    tDisplay.textContent = formatTimerTime(tTimeRemaining);
}

tStartBtn.onclick = () => {
    if (tRunning) return;
    
    // Get time from inputs only if timer is not already running
    if (tTimeRemaining === 0) {
        const hours = parseInt(tHoursInput.value) || 0;
        const minutes = parseInt(tMinutesInput.value) || 0;
        const seconds = parseInt(tSecondsInput.value) || 0;
        tTimeRemaining = (hours * 3600) + (minutes * 60) + seconds;
    }

    if (tTimeRemaining > 0) {
        tRunning = true;
        tInterval = setInterval(updateTimer, 1000);
    }
};

tPauseBtn.onclick = () => {
    if (!tRunning) return;
    tRunning = false;
    clearInterval(tInterval);
};

tResetBtn.onclick = () => {
    tRunning = false;
    clearInterval(tInterval);
    tTimeRemaining = 0;
    tDisplay.textContent = "00:00:00";
    tHoursInput.value = "";
    tMinutesInput.value = "";
    tSecondsInput.value = "";
};


// --- History Logic (Simple Frontend Version) ---
function logActivity(type, duration) {
    const li = document.createElement('li');
    const now = new Date().toLocaleString();
    li.textContent = `[${now}] ${type} Record: ${duration}`;
    historyList.prepend(li); // Add new item to the top

    // !-- IMPORTANT --!
    // This is where you would send data to your backend database
    // instead of just to the screen.
    // e.g., saveToFirebase({ type: type, duration: duration, timestamp: new Date() });
}
