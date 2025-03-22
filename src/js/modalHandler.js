// Modal Handler - Focused file for handling modal functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeModal();
  });
  
  /**
   * Initialize the modal functionality
   */
  function initializeModal() {
    const modal = document.getElementById('card-modal');
    const closeButton = modal ? modal.querySelector('.close-modal') : null;
    
    // Close modal when clicking the close button
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        closeModal(modal);
      });
    }
    
    // Close modal when clicking outside the modal content
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
      
      // Close modal when pressing the Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
          closeModal(modal);
        }
      });
    }
    
    // Set up all expand buttons
    setupExpandButtons();
  }
  
  /**
   * Sets up event listeners for all card expand buttons
   */
  function setupExpandButtons() {
    const expandButtons = document.querySelectorAll('.expand-btn');
    expandButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card) {
          openCardInModal(card);
        }
      });
    });
  }
  
  /**
   * Opens a card in the modal
   * @param {HTMLElement} card - The card element to open in the modal
   */
  function openCardInModal(card) {
    const modal = document.getElementById('card-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    // Set the active card type in app state
    const cardType = card.getAttribute('data-card-type');
    window.appState = window.appState || {};
    window.appState.activeCard = cardType;
    
    // Update modal content
    const cardTitle = card.querySelector('.card-header h2').textContent;
    modalTitle.textContent = cardTitle;
    
    // Clone the card body content into the modal
    const cardBody = card.querySelector('.card-body').cloneNode(true);
    modalBody.innerHTML = '';
    modalBody.appendChild(cardBody);
    
    // Apply modal size preferences
    const modalContent = modal.querySelector('.modal-content');
    if (window.appState.modalSize === 'fullscreen') {
      modalContent.classList.add('fullscreen');
    } else {
      modalContent.classList.remove('fullscreen');
    }
    
    // Open the modal
    modal.classList.add('open');
    
    // Initialize specific card functionality in the modal
    initializeCardInModal(cardType);
  }
  
  /**
   * Close the modal
   * @param {HTMLElement} modal - The modal element to close
   */
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    
    // Reset active card in app state
    if (window.appState) {
      window.appState.activeCard = null;
    }
  }
  
  /**
   * Initialize card-specific functionality when opened in the modal
   * @param {string} cardType - The type of card opened in the modal
   */
  function initializeCardInModal(cardType) {
    switch (cardType) {
      case 'todo':
        initializeTodoInModal();
        break;
      case 'calendar':
        initializeCalendarInModal();
        break;
      case 'timer':
        initializeTimerInModal();
        break;
      case 'clock':
        initializeClockInModal();
        break;
      case 'counter':
        initializeCounterInModal();
        break;
      case 'planner':
        initializePlannerInModal();
        break;
      case 'notes':
        initializeNotesInModal();
        break;
      case 'motivational':
        initializeMotivationalInModal();
        break;
      default:
        console.log(`No specific initialization for ${cardType}`);
        break;
    }
  }
  
  // Todo functionality in modal
  function initializeTodoInModal() {
    const todoInput = document.querySelector('#modal-body .todo-form input');
    const addTodoBtn = document.querySelector('#modal-body .todo-form button');
    
    if (todoInput && addTodoBtn) {
      // Create new button to avoid duplicate event listeners
      const newAddTodoBtn = addTodoBtn.cloneNode(true);
      addTodoBtn.parentNode.replaceChild(newAddTodoBtn, addTodoBtn);
      
      // Add event listener
      newAddTodoBtn.addEventListener('click', () => {
        if (todoInput.value.trim()) {
          // Check if the addTodo function exists in the global scope
          if (typeof addTodo === 'function') {
            addTodo(todoInput.value);
            todoInput.value = '';
          } else {
            console.error('addTodo function not found');
          }
        }
      });
      
      // Handle Enter key
      todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && todoInput.value.trim()) {
          if (typeof addTodo === 'function') {
            addTodo(todoInput.value);
            todoInput.value = '';
          } else {
            console.error('addTodo function not found');
          }
        }
      });
    }
  }
  
  // Calendar functionality in modal
  function initializeCalendarInModal() {
    // Re-init calendar if needed
    if (typeof updateCalendar === 'function') {
      updateCalendar();
    }
  }
  
  // Timer functionality in modal
  function initializeTimerInModal() {
    const startBtn = document.querySelector('#modal-body #timer-start');
    const pauseBtn = document.querySelector('#modal-body #timer-pause');
    const resetBtn = document.querySelector('#modal-body #timer-reset');
    const timerTypeBtns = document.querySelectorAll('#modal-body .timer-type-btn');
    const customTimerSection = document.querySelector('#modal-body .custom-timer-section');
    const audioToggle = document.querySelector('#modal-body #timer-audio-toggle');
    
    // Initialize custom timer section if it doesn't exist
    if (!customTimerSection && startBtn) {
      const container = startBtn.closest('.timer-container');
      if (container) {
        // Create custom timer section
        const customSection = document.createElement('div');
        customSection.className = 'custom-timer-section';
        customSection.innerHTML = `
          <div class="custom-timer-input">
            <input type="number" id="custom-minutes" min="1" max="180" value="25" placeholder="Minutes">
            <button id="set-custom-timer">Set</button>
          </div>
          <div class="audio-toggle">
            <label for="timer-audio-toggle">Timer Sound:</label>
            <input type="checkbox" id="timer-audio-toggle" checked>
          </div>
        `;
        
        // Insert before the timer type buttons
        const timerType = container.querySelector('.timer-type');
        if (timerType) {
          container.insertBefore(customSection, timerType);
        } else {
          container.appendChild(customSection);
        }
        
        // Add event listener for custom timer button
        const setCustomBtn = customSection.querySelector('#set-custom-timer');
        const customMinutesInput = customSection.querySelector('#custom-minutes');
        
        if (setCustomBtn && customMinutesInput) {
          setCustomBtn.addEventListener('click', () => {
            const minutes = parseInt(customMinutesInput.value);
            if (minutes > 0 && minutes <= 180) {
              const timerState = {
                minutes: minutes,
                seconds: 0,
                isRunning: false
              };
              
              // Reset timer with custom minutes
              if (typeof resetTimer === 'function') {
                resetTimer(timerState, document.querySelector('.timer-display'), startBtn, pauseBtn);
              } else {
                // Fallback if resetTimer is not available
                const timerDisplay = document.querySelector('.timer-display');
                if (timerDisplay) {
                  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:00`;
                }
              }
            }
          });
        }
        
        // Add audio toggle functionality
        const audioToggle = customSection.querySelector('#timer-audio-toggle');
        if (audioToggle) {
          // Initialize from localStorage
          const timerAudioEnabled = localStorage.getItem('timer-audio-enabled') !== 'false';
          audioToggle.checked = timerAudioEnabled;
          
          audioToggle.addEventListener('change', (e) => {
            localStorage.setItem('timer-audio-enabled', e.target.checked);
          });
        }
      }
    }
    
    if (startBtn && pauseBtn && resetBtn) {
      // Remove any existing event listeners by cloning the elements
      const newStartBtn = startBtn.cloneNode(true);
      const newPauseBtn = pauseBtn.cloneNode(true);
      const newResetBtn = resetBtn.cloneNode(true);
      
      startBtn.parentNode.replaceChild(newStartBtn, startBtn);
      pauseBtn.parentNode.replaceChild(newPauseBtn, pauseBtn);
      resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
      
      // Add new event listeners
      newStartBtn.addEventListener('click', () => {
        if (typeof startTimer === 'function') {
          // Extract the timerState from the DOM
          const timerDisplay = document.querySelector('#modal-body .timer-display');
          const [minutes, seconds] = timerDisplay.textContent.split(':').map(Number);
          
          const timerState = {
            minutes: minutes,
            seconds: seconds,
            isRunning: false
          };
          
          startTimer(timerState, timerDisplay, newStartBtn, newPauseBtn);
        }
      });
      
      newPauseBtn.addEventListener('click', () => {
        if (typeof pauseTimer === 'function') {
          pauseTimer({isRunning: true}, newStartBtn, newPauseBtn);
        }
      });
      
      newResetBtn.addEventListener('click', () => {
        if (typeof resetTimer === 'function') {
          const timerDisplay = document.querySelector('#modal-body .timer-display');
          resetTimer({}, timerDisplay, newStartBtn, newPauseBtn);
        }
      });
    }
    
    // Handle timer type buttons
    if (timerTypeBtns && timerTypeBtns.length > 0) {
      timerTypeBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', () => {
          // Remove active class from all buttons
          timerTypeBtns.forEach(b => b.classList.remove('active'));
          // Add active class to clicked button
          newBtn.classList.add('active');
          
          if (typeof setTimerType === 'function') {
            setTimerType(newBtn.getAttribute('data-time'));
          } else {
            // Fallback if setTimerType is not available
            const minutes = parseInt(newBtn.getAttribute('data-time') || '25');
            const timerDisplay = document.querySelector('.timer-display');
            if (timerDisplay) {
              timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:00`;
            }
          }
        });
      });
    }
    
    // Make sure we have the audio file for the timer
    if (!document.getElementById('timer-audio')) {
      const audioElement = document.createElement('audio');
      audioElement.id = 'timer-audio';
      audioElement.src = 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3';
      document.body.appendChild(audioElement);
    }
  }
  
  // Clock functionality in modal
  function initializeClockInModal() {
    // Make sure clock updates in modal
    if (typeof updateClock === 'function') {
      updateClock();
    }
    
    // Handle timezone selector
    const timezoneSelector = document.querySelector('#modal-body #timezone-selector');
    if (timezoneSelector) {
      const newSelector = timezoneSelector.cloneNode(true);
      timezoneSelector.parentNode.replaceChild(newSelector, timezoneSelector);
      
      newSelector.addEventListener('change', () => {
        if (typeof changeTimezone === 'function') {
          changeTimezone(newSelector.value);
        }
      });
    }
  }
  
  // Counter functionality in modal
  function initializeCounterInModal() {
    const eventNameInput = document.querySelector('#modal-body #event-name');
    const eventDateInput = document.querySelector('#modal-body #event-date');
    const addEventBtn = document.querySelector('#modal-body #add-event');
    
    if (eventNameInput && eventDateInput && addEventBtn) {
      // Remove any existing event listeners
      const newAddEventBtn = addEventBtn.cloneNode(true);
      addEventBtn.parentNode.replaceChild(newAddEventBtn, addEventBtn);
      
      // Add new event listeners
      newAddEventBtn.addEventListener('click', () => {
        if (eventNameInput.value.trim() && eventDateInput.value) {
          if (typeof addEvent === 'function') {
            addEvent(eventNameInput.value, eventDateInput.value);
            eventNameInput.value = '';
            eventDateInput.value = '';
          }
        }
      });
    }
  }
  
  // Planner functionality in modal
  function initializePlannerInModal() {
    const plannerSchedule = document.querySelector('#modal-body .planner-schedule');
    
    if (plannerSchedule) {
      // Remove existing event listeners
      const newPlannerSchedule = plannerSchedule.cloneNode(true);
      plannerSchedule.parentNode.replaceChild(newPlannerSchedule, plannerSchedule);
      
      // Add delete buttons to each schedule item if they don't exist
      const scheduleItems = newPlannerSchedule.querySelectorAll('.schedule-item');
      scheduleItems.forEach(item => {
        if (!item.querySelector('.delete-schedule-item')) {
          const deleteButton = document.createElement('button');
          deleteButton.className = 'delete-schedule-item';
          deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
          deleteButton.setAttribute('aria-label', 'Delete');
          item.appendChild(deleteButton);
          
          // Add event listener for delete button
          deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the edit
            
            const itemId = item.getAttribute('data-id');
            
            // Remove from DOM
            item.remove();
            
            // Remove from localStorage
            const schedule = JSON.parse(localStorage.getItem('daily-schedule') || '[]');
            const updatedSchedule = schedule.filter(entry => entry.id !== itemId);
            localStorage.setItem('daily-schedule', JSON.stringify(updatedSchedule));
          });
        }
      });
      
      // Get saved schedule from localStorage
      const savedSchedule = JSON.parse(localStorage.getItem('daily-schedule') || '[]');
      
      // Check if renderSchedule function exists
      if (typeof renderSchedule === 'function') {
        renderSchedule(savedSchedule, newPlannerSchedule);
        
        // Add delete buttons to the newly rendered schedule items
        const newItems = newPlannerSchedule.querySelectorAll('.schedule-item');
        newItems.forEach(item => {
          if (!item.querySelector('.delete-schedule-item')) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-schedule-item';
            deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
            deleteButton.setAttribute('aria-label', 'Delete');
            item.appendChild(deleteButton);
            
            // Add event listener for delete button
            deleteButton.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent triggering the edit
              
              const itemId = item.getAttribute('data-id');
              
              // Remove from DOM
              item.remove();
              
              // Remove from localStorage
              const schedule = JSON.parse(localStorage.getItem('daily-schedule') || '[]');
              const updatedSchedule = schedule.filter(entry => entry.id !== itemId);
              localStorage.setItem('daily-schedule', JSON.stringify(updatedSchedule));
            });
          }
        });
      }
      
      // Add event delegation for editing schedule items
      newPlannerSchedule.addEventListener('click', handlePlannerItemClick);
    }
  }
  
  // Helper function for planner item clicks
  function handlePlannerItemClick(e) {
    if (e.target.matches('.schedule-content') || e.target.closest('.schedule-content')) {
      const scheduleItem = e.target.closest('.schedule-item');
      if (!scheduleItem) return;
      
      const scheduleContent = scheduleItem.querySelector('.schedule-content');
      const itemId = scheduleItem.getAttribute('data-id');
      
      // Create input for editing
      const currentContent = scheduleContent.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentContent;
      input.className = 'schedule-edit-input';
      
      // Replace content with input
      scheduleContent.innerHTML = '';
      scheduleContent.appendChild(input);
      input.focus();
      
      // Save on blur or Enter key
      const saveScheduleItem = function() {
        const newContent = input.value;
        scheduleContent.textContent = newContent;
        
        // Save to localStorage
        const schedule = JSON.parse(localStorage.getItem('daily-schedule') || '[]');
        const itemIndex = schedule.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          schedule[itemIndex].content = newContent;
          localStorage.setItem('daily-schedule', JSON.stringify(schedule));
        }
        
        // Remove event listeners
        input.removeEventListener('blur', saveScheduleItem);
        input.removeEventListener('keypress', handleKeyPress);
      };
      
      const handleKeyPress = function(e) {
        if (e.key === 'Enter') {
          saveScheduleItem();
        }
      };
      
      input.addEventListener('blur', saveScheduleItem);
      input.addEventListener('keypress', handleKeyPress);
    }
  }
  
  // Notes functionality in modal
  function initializeNotesInModal() {
    const noteContent = document.querySelector('#modal-body #note-content');
    const addNoteBtn = document.querySelector('#modal-body #add-note');
    const colorBtns = document.querySelectorAll('#modal-body .color-btn');
    
    if (noteContent && addNoteBtn) {
      // Remove existing event listeners
      const newAddNoteBtn = addNoteBtn.cloneNode(true);
      addNoteBtn.parentNode.replaceChild(newAddNoteBtn, addNoteBtn);
      
      // Add new event listeners
      newAddNoteBtn.addEventListener('click', () => {
        if (noteContent.value.trim()) {
          let selectedColor = '#ffffcc'; // Default color
          
          // Find the selected color
          const selectedColorBtn = document.querySelector('#modal-body .color-btn.selected');
          if (selectedColorBtn) {
            selectedColor = selectedColorBtn.getAttribute('data-color') || selectedColor;
          }
          
          if (typeof addNote === 'function') {
            addNote(noteContent.value, selectedColor);
            noteContent.value = '';
          }
        }
      });
    }
    
    // Set up color buttons
    if (colorBtns.length > 0) {
      colorBtns.forEach(btn => {
        // Remove existing event listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Set button background color
        const color = newBtn.getAttribute('data-color');
        if (color) {
          newBtn.style.backgroundColor = color;
        }
        
        // Add new event listener
        newBtn.addEventListener('click', () => {
          // Remove selected class from all buttons
          colorBtns.forEach(b => {
            const element = document.querySelector(`#modal-body .color-btn[data-color="${b.getAttribute('data-color')}"]`);
            if (element) element.classList.remove('selected');
          });
          
          // Add selected class to clicked button
          newBtn.classList.add('selected');
        });
      });
      
      // Select the first color by default
      const firstColorBtn = document.querySelector('#modal-body .color-btn');
      if (firstColorBtn) {
        firstColorBtn.classList.add('selected');
      }
    }
  }
  
  // Initialize the motivational quotes widget in modal
  function initializeMotivationalInModal() {
    const quoteContainer = document.querySelector('#modal-body .quotes-container');
    
    if (quoteContainer) {
      // Load saved quotes or use defaults
      let quotes = JSON.parse(localStorage.getItem('motivational-quotes') || '[]');
      if (quotes.length === 0) {
        quotes = [
          { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
          { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
          { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
          { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
          { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
        ];
        localStorage.setItem('motivational-quotes', JSON.stringify(quotes));
      }
      
      // Display the quotes
      displayRandomQuote(quotes, quoteContainer);
      
      // Set up auto-rotation of quotes
      let quoteInterval = setInterval(() => {
        displayRandomQuote(quotes, quoteContainer);
      }, 10000); // Change quote every 10 seconds
      
      // Clean up interval when modal is closed
      document.getElementById('card-modal').addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('close-modal')) {
          clearInterval(quoteInterval);
        }
      });
    }
  }
  
  // Helper function to display a random quote
  function displayRandomQuote(quotes, container) {
    if (!container || quotes.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    container.innerHTML = `
      <div class="quote-content fade-in">
        <p class="quote-text">"${quote.text}"</p>
        <p class="quote-author">— ${quote.author}</p>
      </div>
    `;
  }
  
  // Function to handle the timer completion audio
  function playTimerAudio() {
    const audioEnabled = localStorage.getItem('timer-audio-enabled') !== 'false';
    
    if (audioEnabled) {
      const audio = document.getElementById('timer-audio');
      if (audio) {
        audio.currentTime = 0; // Reset the audio to the beginning
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    }
  }
  
  // Override the notifyTimerFinished function to include audio
  window.notifyTimerFinished = function() {
    // Play the audio alert
    playTimerAudio();
    
    console.log('Timer finished!');
    
    // Show browser notification if permission is granted
    if (Notification.permission === 'granted') {
      new Notification('Timer Finished', {
        body: 'Your timer has completed!',
        icon: '/favicon.ico'
      });
    } 
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Timer Finished', {
            body: 'Your timer has completed!',
            icon: '/favicon.ico'
          });
        }
      });
    }
  };
  