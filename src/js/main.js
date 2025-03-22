// Global variables for app state
const appState = {
    theme: localStorage.getItem('theme') || 'default',
    prefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    modalSize: localStorage.getItem('modalSize') || 'default',
    activeCard: null,
  };
  
  // Initialize the application
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Personal Event Manager initialized');
    
    // Initialize theme
    if (appState.prefersDark && !localStorage.getItem('theme')) {
      document.body.classList.add('dark-theme');
    } else if (appState.theme === 'dark') {
      document.body.classList.add('dark-theme');
    }
    
    // Apply custom theme if set
    if (appState.theme && appState.theme !== 'default' && appState.theme !== 'dark') {
      document.body.classList.add(`theme-${appState.theme}`);
    }
  
    // Initialize the current date in the planner
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      currentDateElement.textContent = now.toLocaleDateString(undefined, options);
    }
  
    // Add event listeners for card expansion
    const expandButtons = document.querySelectorAll('.expand-btn');
    expandButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card) {
          openCardInModal(card);
        }
      });
    });
  });
  
  // Function to open a card in a modal
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
  
  // Initialize functionality when a card is opened in modal
  function initModalCardFunctionality(cardType) {
    switch (cardType) {
      case 'todo':
        // No special initialization needed for todos in modal
        break;
      case 'calendar':
        // Maybe reinitialize the calendar if needed
        break;
      case 'timer':
        // No special initialization needed for timer in modal
        break;
      case 'clock':
        // Make sure clock updates in modal
        updateClock();
        break;
      case 'counter':
        // No special initialization needed for counter in modal
        break;
      case 'planner':
        // No special initialization needed for planner in modal
        break;
      case 'notes':
        // No special initialization needed for notes in modal
        break;
      default:
        break;
    }
  }
  
  // Helper function to format time (used by multiple components)
  function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  
  // Helper function to format date (used by multiple components)
  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
  
  // Helper function to calculate days between dates
  function calculateDaysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
    return diffDays;
  }
  