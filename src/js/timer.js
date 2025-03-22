document.addEventListener('DOMContentLoaded', () => {
  initTimer();
});

function initTimer() {
  const timerDisplay = document.querySelector('.timer-display');
  const startButton = document.getElementById('timer-start');
  const pauseButton = document.getElementById('timer-pause');
  const resetButton = document.getElementById('timer-reset');
  const timerTypeButtons = document.querySelectorAll(".timer-type-btn");
  const timerContainer = document.querySelector('.timer-container');
  const alarmSound = document.getElementById("timer-audio"); // Existing <audio> element

  // We'll assume your HTML has a Stop Sound button with class "stop-sound" 
  // If not, we create one here and append it to the timer container.
  let stopSoundButton = document.querySelector('.timer-type-btn.stop-sound');
  if (!stopSoundButton) {
    stopSoundButton = document.createElement("button");
    stopSoundButton.className = "timer-type-btn stop-sound";
    stopSoundButton.textContent = "Stop Sound";
    timerContainer.appendChild(stopSoundButton);
  }
  stopSoundButton.style.display = "none";

  // Ensure the alarm loops until stopped
  alarmSound.loop = true;

  // Timer state
  let timerState = { minutes: 25, seconds: 0, isRunning: false, timerId: null };

  // Function to update the display
  function updateTimerDisplay() {
    const m = String(timerState.minutes).padStart(2, '0');
    const s = String(timerState.seconds).padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
  }
  updateTimerDisplay();

  // Event listeners for mode buttons (Pomodoro, Short Break, Long Break)
  timerTypeButtons.forEach(button => {
    // Skip the Stop Sound button if it's among the timerTypeButtons
    if (button.classList.contains("stop-sound")) return;
    button.addEventListener("click", () => {
      // Remove active class from all mode buttons
      timerTypeButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      let newTime = parseInt(button.dataset.time, 10);
      if (!isNaN(newTime)) {
        clearInterval(timerState.timerId);
        timerState = { minutes: newTime, seconds: 0, isRunning: false, timerId: null };
        startButton.disabled = false;
        pauseButton.disabled = true;
        updateTimerDisplay();
      }
    });
  });

  // Custom timer input section
  if (timerContainer && !document.querySelector('.custom-timer-section')) {
    const customSection = document.createElement('div');
    customSection.className = 'custom-timer-section';
    customSection.innerHTML = `
      <div class="custom-timer-input">
        <input type="number" id="custom-minutes" min="0" max="180" value="25" placeholder="Minutes">
        <input type="number" id="custom-seconds" min="0" max="59" value="0" placeholder="Seconds">
        <button id="set-custom-timer">Set Timer</button>
      </div>
    `;
    timerContainer.appendChild(customSection);
    
    const setCustomBtn = document.getElementById('set-custom-timer');
    const customMinutesInput = document.getElementById('custom-minutes');
    const customSecondsInput = document.getElementById('custom-seconds');
    
    setCustomBtn.addEventListener('click', () => {
      let m = parseInt(customMinutesInput.value);
      let s = parseInt(customSecondsInput.value);
      if (!isNaN(m) && !isNaN(s) && m >= 0 && m <= 180 && s >= 0 && s <= 59) {
        clearInterval(timerState.timerId);
        timerState = { minutes: m, seconds: s, isRunning: false, timerId: null };
        startButton.disabled = false;
        pauseButton.disabled = true;
        // Optionally, remove the active class from mode buttons since a custom time is used.
        timerTypeButtons.forEach(btn => btn.classList.remove("active"));
        updateTimerDisplay();
      }
    });
  }

  // Start button
  startButton.addEventListener('click', () => {
    if (!timerState.isRunning) {
      timerState.isRunning = true;
      startButton.disabled = true;
      pauseButton.disabled = false;
      timerState.timerId = setInterval(() => {
        if (timerState.minutes === 0 && timerState.seconds === 0) {
          clearInterval(timerState.timerId);
          timerState.isRunning = false;
          startButton.disabled = false;
          pauseButton.disabled = true;
          notifyTimerFinished();
          return;
        }
        if (timerState.seconds === 0) {
          timerState.minutes--;
          timerState.seconds = 59;
        } else {
          timerState.seconds--;
        }
        updateTimerDisplay();
      }, 1000);
    }
  });

  // Pause button
  pauseButton.addEventListener('click', () => {
    if (timerState.isRunning) {
      clearInterval(timerState.timerId);
      timerState.isRunning = false;
      startButton.disabled = false;
      pauseButton.disabled = true;
    }
  });

  // Reset button: Now resets to the current active mode if available.
  resetButton.addEventListener('click', () => {
    clearInterval(timerState.timerId);
    // Look for an active mode button to determine the reset time.
    const activeButton = document.querySelector(".timer-type-btn.active");
    let newTime = activeButton ? parseInt(activeButton.dataset.time, 10) : 25;
    if (isNaN(newTime)) newTime = 25;
    timerState = { minutes: newTime, seconds: 0, isRunning: false, timerId: null };
    startButton.disabled = false;
    pauseButton.disabled = true;
    stopSoundButton.style.display = "none";
    alarmSound.pause();
    alarmSound.currentTime = 0;
    updateTimerDisplay();
  });

  // Stop Sound button
  stopSoundButton.addEventListener('click', () => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    stopSoundButton.style.display = "none";
  });

  // When timer finishes: play alarm and show stop button
  function notifyTimerFinished() {
    alarmSound.currentTime = 0;
    alarmSound.play().catch(error => console.error("Audio play failed:", error));
    stopSoundButton.style.display = "block";
    if (Notification.permission === 'granted') {
      new Notification("Timer Finished", {
        body: "Your timer has completed!",
        icon: "/favicon.ico"
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Timer Finished", {
            body: "Your timer has completed!",
            icon: "/favicon.ico"
          });
        }
      });
    }
  }
}
