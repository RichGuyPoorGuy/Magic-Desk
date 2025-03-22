// Clock functionality
document.addEventListener('DOMContentLoaded', () => {
    initClock();
  });
  
  // Initialize the clock
  function initClock() {
    const digitalClock = document.getElementById('digital-clock');
    const timezoneSelector = document.getElementById('timezone-selector');
    
    // Clock state
    const clockState = {
      timezone: localStorage.getItem('clock-timezone') || 'local'
    };
    
    // Update the timezone selector value from saved preference
    if (timezoneSelector) {
      timezoneSelector.value = clockState.timezone;
    }
    
    // Start clock and update every second
    updateClock(clockState, digitalClock);
    setInterval(() => updateClock(clockState, digitalClock), 1000);
    
    // Add event listener for timezone changes
    if (timezoneSelector) {
      timezoneSelector.addEventListener('change', (e) => {
        clockState.timezone = e.target.value;
        localStorage.setItem('clock-timezone', clockState.timezone);
        updateClock(clockState, digitalClock);
      });
    }
  }
  
  // Update the clock display
  function updateClock(clockState, digitalClock) {
    if (!digitalClock) return;
    
    let time;
    const now = new Date();
    
    if (clockState.timezone === 'local') {
      time = formatTime(now);
    } else {
      // Convert to the selected timezone
      try {
        time = formatTimeInTimezone(now, clockState.timezone);
      } catch (error) {
        console.error('Error formatting time in timezone:', error);
        time = formatTime(now);
      }
    }
    
    digitalClock.textContent = time;
  }
  
  // Format time in a specific timezone
  function formatTimeInTimezone(date, timezone) {
    try {
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timezone
      };
      
      return date.toLocaleTimeString(undefined, options);
    } catch (error) {
      console.error('Error formatting time in timezone:', error);
      return formatTime(date);
    }
  }
  