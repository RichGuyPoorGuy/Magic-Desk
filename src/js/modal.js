// Modal functionality
document.addEventListener('DOMContentLoaded', () => {
  initModal();
  setupExpansionButtons();
});

// Initialize the modal
function initModal() {
  const modal = document.getElementById('card-modal');
  const closeButton = modal.querySelector('.close-modal');
  
  // Close modal when clicking the close button
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      closeModal(modal);
    });
  }
  
  // Close modal when clicking outside the modal content
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

// Setup expand buttons for all cards
function setupExpansionButtons() {
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

// Open a card in the modal
function openCardInModal(card) {
  const modal = document.getElementById('card-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  // Set the active card
  appState.activeCard = card.getAttribute('data-card-type');
  
  // Update modal content
  const cardTitle = card.querySelector('.card-header h2').textContent;
  modalTitle.textContent = cardTitle;
  
  // Clone the card body content into the modal
  const cardBody = card.querySelector('.card-body').cloneNode(true);
  modalBody.innerHTML = '';
  modalBody.appendChild(cardBody);
  
  // Apply modal size preferences
  const modalContent = modal.querySelector('.modal-content');
  if (appState.modalSize === 'fullscreen') {
    modalContent.classList.add('fullscreen');
  } else {
    modalContent.classList.remove('fullscreen');
  }
  
  // Open the modal
  modal.classList.add('open');
  
  // Trigger any needed initializations for the specific card type
  initModalCardFunctionality(appState.activeCard);
}

// Close the modal
function closeModal(modal) {
  modal.classList.remove('open');
  
  // Reset active card
  appState.activeCard = null;
}

// Initialize functionality when a card is opened in modal
function initModalCardFunctionality(cardType) {
  switch (cardType) {
    case 'todo':
      // Reinitialize todo functionality in modal
      const todoInput = document.querySelector('#modal-body .todo-form input');
      const addTodoBtn = document.querySelector('#modal-body .todo-form button');
      if (todoInput && addTodoBtn) {
        addTodoBtn.addEventListener('click', () => {
          if (todoInput.value.trim()) {
            addTodo(todoInput.value);
            todoInput.value = '';
          }
        });
      }
      break;
    case 'calendar':
      // Maybe reinitialize the calendar if needed
      break;
    case 'timer':
      // Reinitialize timer controls in modal
      const startBtn = document.querySelector('#modal-body #timer-start');
      const pauseBtn = document.querySelector('#modal-body #timer-pause');
      const resetBtn = document.querySelector('#modal-body #timer-reset');
      if (startBtn && pauseBtn && resetBtn) {
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);
      }
      break;
    case 'clock':
      // Make sure clock updates in modal
      updateClock();
      break;
    case 'counter':
      // Reinitialize counter functionality in modal
      const eventNameInput = document.querySelector('#modal-body #event-name');
      const eventDateInput = document.querySelector('#modal-body #event-date');
      const addEventBtn = document.querySelector('#modal-body #add-event');
      if (eventNameInput && eventDateInput && addEventBtn) {
        addEventBtn.addEventListener('click', () => {
          if (eventNameInput.value.trim() && eventDateInput.value) {
            addEvent(eventNameInput.value, eventDateInput.value);
            eventNameInput.value = '';
            eventDateInput.value = '';
          }
        });
      }
      break;
    case 'planner':
      // Initialize planner in modal with specific handling
      const plannerSchedule = document.querySelector('#modal-body .planner-schedule');
      if (plannerSchedule) {
        // Get saved schedule from localStorage
        const savedSchedule = JSON.parse(localStorage.getItem('daily-schedule') || '[]');
        renderSchedule(savedSchedule, plannerSchedule);
        
        // Add event delegation for editing schedule items in modal
        plannerSchedule.addEventListener('click', handlePlannerItemClick);
      }
      break;
    case 'notes':
      // Reinitialize notes functionality in modal
      const noteContent = document.querySelector('#modal-body #note-content');
      const addNoteBtn = document.querySelector('#modal-body #add-note');
      const colorBtns = document.querySelectorAll('#modal-body .color-btn');
      if (noteContent && addNoteBtn) {
        addNoteBtn.addEventListener('click', () => {
          if (noteContent.value.trim()) {
            const selectedColor = document.querySelector('#modal-body .color-btn.selected');
            const color = selectedColor ? selectedColor.getAttribute('data-color') : '#ffffcc';
            addNote(noteContent.value, color);
            noteContent.value = '';
          }
        });
        
        // Add color selection
        colorBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
          });
        });
      }
      break;
    default:
      break;
  }
}

// Helper function for planner item clicks
function handlePlannerItemClick(e) {
  if (e.target.matches('.schedule-content') || e.target.closest('.schedule-content')) {
    const scheduleItem = e.target.closest('.schedule-item');
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
    input.addEventListener('blur', saveScheduleItem);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveScheduleItem(e);
      }
    });
    
    function saveScheduleItem(e) {
      const newContent = input.value;
      scheduleContent.textContent = newContent;
      
      // Save to localStorage
      const schedule = JSON.parse(localStorage.getItem('daily-schedule') || '[]');
      const itemIndex = schedule.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        schedule[itemIndex].content = newContent;
        localStorage.setItem('daily-schedule', JSON.stringify(schedule));
      }
      
      // Remove input and event listeners
      input.removeEventListener('blur', saveScheduleItem);
    }
  }
}
