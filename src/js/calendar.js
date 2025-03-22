// Calendar functionality
document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
  });
  
  // Initialize the calendar
  function initCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    
    // Initialize calendar state
    const calendarState = {
      currentDate: new Date(),
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      events: JSON.parse(localStorage.getItem('events') || '[]')
    };
    
    // Render the initial calendar
    renderCalendar(calendarState);
    
    // Add event listeners for month navigation
    if (prevMonthButton) {
      prevMonthButton.addEventListener('click', () => {
        calendarState.currentMonth--;
        if (calendarState.currentMonth < 0) {
          calendarState.currentMonth = 11;
          calendarState.currentYear--;
        }
        renderCalendar(calendarState);
      });
    }
    
    if (nextMonthButton) {
      nextMonthButton.addEventListener('click', () => {
        calendarState.currentMonth++;
        if (calendarState.currentMonth > 11) {
          calendarState.currentMonth = 0;
          calendarState.currentYear++;
        }
        renderCalendar(calendarState);
      });
    }
    
    // Add event delegation for calendar days
    if (calendarGrid) {
      calendarGrid.addEventListener('click', (e) => {
        const dayElement = e.target.closest('.calendar-day');
        if (dayElement && !dayElement.classList.contains('empty')) {
          const day = parseInt(dayElement.textContent);
          const date = new Date(calendarState.currentYear, calendarState.currentMonth, day);
          
          // In a real app, we'd show a modal to add events
          // For simplicity, we'll just console log the date
          console.log('Selected date:', formatDate(date));
        }
      });
    }
  }
  
  // Render the calendar for a specific month and year
  function renderCalendar(calendarState) {
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    if (!calendarGrid || !currentMonthElement) return;
    
    // Update the month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthElement.textContent = `${monthNames[calendarState.currentMonth]} ${calendarState.currentYear}`;
    
    // Clear previous days (except weekday headers)
    const dayElements = calendarGrid.querySelectorAll('.calendar-day');
    dayElements.forEach(day => day.remove());
    
    // Get the first day of the month
    const firstDay = new Date(calendarState.currentYear, calendarState.currentMonth, 1);
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get the number of days in the month
    const lastDay = new Date(calendarState.currentYear, calendarState.currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Get today's date for highlighting
    const today = new Date();
    const isCurrentMonth = today.getMonth() === calendarState.currentMonth && today.getFullYear() === calendarState.currentYear;
    
    // Create empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendarGrid.appendChild(emptyDay);
    }
    
    // Create cells for each day of the month
    for (let i = 1; i <= totalDays; i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = i;
      
      // Highlight today
      if (isCurrentMonth && i === today.getDate()) {
        dayElement.classList.add('today');
      }
      
      // Check if this day has events
      const currentDate = new Date(calendarState.currentYear, calendarState.currentMonth, i);
      const hasEvents = calendarState.events.some(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === i && 
               eventDate.getMonth() === calendarState.currentMonth && 
               eventDate.getFullYear() === calendarState.currentYear;
      });
      
      if (hasEvents) {
        dayElement.classList.add('has-event');
      }
      
      calendarGrid.appendChild(dayElement);
    }
  }
  