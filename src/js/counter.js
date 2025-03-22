// Days counter functionality
document.addEventListener('DOMContentLoaded', () => {
    initDaysCounter();
  });
  
  // Initialize the days counter
  function initDaysCounter() {
    const eventNameInput = document.getElementById('event-name');
    const eventDateInput = document.getElementById('event-date');
    const addEventButton = document.getElementById('add-event');
    const counterList = document.querySelector('.counter-list');
    
    // Load saved events from localStorage
    const savedEvents = JSON.parse(localStorage.getItem('counter-events') || '[]');
    
    // Render saved events
    savedEvents.forEach(event => {
      addEventToDOM(event.id, event.name, event.date);
    });
    
    // Set min date to today for date picker
    if (eventDateInput) {
      const today = new Date().toISOString().split('T')[0];
      eventDateInput.min = today;
    }
    
    // Add event listener for adding new events
    if (addEventButton && eventNameInput && eventDateInput) {
      addEventButton.addEventListener('click', () => {
        const eventName = eventNameInput.value.trim();
        const eventDate = eventDateInput.value;
        
        if (eventName && eventDate) {
          const eventId = Date.now().toString();
          
          // Add to DOM
          addEventToDOM(eventId, eventName, eventDate);
          
          // Save to localStorage
          savedEvents.push({ id: eventId, name: eventName, date: eventDate });
          localStorage.setItem('counter-events', JSON.stringify(savedEvents));
          
          // Clear the inputs
          eventNameInput.value = '';
          eventDateInput.value = '';
        }
      });
    }
    
    // Add event delegation for counter list
    if (counterList) {
      counterList.addEventListener('click', (e) => {
        if (e.target.matches('.counter-item-delete') || e.target.closest('.counter-item-delete')) {
          const counterItem = e.target.closest('.counter-item');
          const eventId = counterItem.getAttribute('data-id');
          
          // Remove from DOM
          counterItem.remove();
          
          // Remove from localStorage
          const events = JSON.parse(localStorage.getItem('counter-events') || '[]');
          const updatedEvents = events.filter(event => event.id !== eventId);
          localStorage.setItem('counter-events', JSON.stringify(updatedEvents));
        }
      });
    }
    
    // Update all counters daily (will also run on load)
    updateAllCounters();
    
    // Update counters again after midnight
    scheduleNextDayUpdate();
  }
  
  // Helper function to add an event to the DOM
  function addEventToDOM(id, name, date) {
    const counterList = document.querySelector('.counter-list');
    if (!counterList) return;
    
    const counterItem = document.createElement('div');
    counterItem.className = 'counter-item';
    counterItem.setAttribute('data-id', id);
    counterItem.setAttribute('data-date', date);
    
    // Calculate days remaining
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    
    const daysRemaining = calculateDaysBetween(today, eventDate);
    const isInPast = eventDate < today;
    
    counterItem.innerHTML = `
      <div class="counter-item-info">
        <span class="counter-item-name">${name}</span>
        <span class="counter-item-date">${formatDate(eventDate)}</span>
      </div>
      <span class="counter-item-days">${isInPast ? 'Past event' : daysRemaining === 0 ? 'Today' : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`}</span>
      <button class="counter-item-delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    
    counterList.appendChild(counterItem);
  }
  
  // Update all day counters
  function updateAllCounters() {
    const counterItems = document.querySelectorAll('.counter-item');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    counterItems.forEach(item => {
      const dateStr = item.getAttribute('data-date');
      const eventDate = new Date(dateStr);
      eventDate.setHours(0, 0, 0, 0);
      
      const daysRemaining = calculateDaysBetween(today, eventDate);
      const isInPast = eventDate < today;
      
      const daysElement = item.querySelector('.counter-item-days');
      if (daysElement) {
        daysElement.textContent = isInPast ? 'Past event' : daysRemaining === 0 ? 'Today' : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
      }
    });
  }
  
  // Schedule update for next day
  function scheduleNextDayUpdate() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow - now;
    
    setTimeout(() => {
      updateAllCounters();
      scheduleNextDayUpdate();
    }, timeUntilMidnight);
  }
  