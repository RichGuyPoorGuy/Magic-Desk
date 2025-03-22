document.addEventListener('DOMContentLoaded', () => {
  initDailyPlanner();
});

// Initialize the daily planner
function initDailyPlanner() {
  const plannerSchedule = document.querySelector('.planner-schedule');

  // Load saved schedule from localStorage
  let savedSchedule = JSON.parse(localStorage.getItem('daily-schedule') || '[]');

  // Create default time slots from 9 AM to 9 PM if none exist
  if (savedSchedule.length === 0) {
    for (let hour = 9; hour <= 21; hour++) {
      savedSchedule.push({
        id: `time-${hour}`,
        time: `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`,
        content: ''
      });
    }
    localStorage.setItem('daily-schedule', JSON.stringify(savedSchedule));
  }

  // Render the schedule
  renderSchedule(savedSchedule, plannerSchedule);

  // Add schedule form
  addScheduleForm(plannerSchedule);

  // Add event delegation for editing & deleting
  plannerSchedule.addEventListener('click', (e) => {
    const scheduleItem = e.target.closest('.schedule-item');
    if (!scheduleItem) return;
    const itemId = scheduleItem.getAttribute('data-id');

    // Handle delete button clicks
    if (e.target.closest('.delete-schedule-item')) {
      deleteScheduleItem(itemId, plannerSchedule);
      return;
    }

    // Handle editing
    if (e.target.matches('.schedule-content') || e.target.closest('.schedule-content')) {
      editScheduleItem(scheduleItem, itemId);
    }
  });
}

// Add a new schedule item
function addScheduleItem(timeValue, content) {
  const timeDate = new Date(`2000-01-01T${timeValue}`);
  const hours = timeDate.getHours();
  const minutes = timeDate.getMinutes();
  const formattedTime = `${hours % 12 === 0 ? 12 : hours % 12}:${minutes.toString().padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`;

  const itemId = `time-${Date.now()}`;
  const newItem = { id: itemId, time: formattedTime, content };

  let schedule = JSON.parse(localStorage.getItem('daily-schedule') || '[]');
  
  // Insert new item in the correct position based on time
  let inserted = false;
  for (let i = 0; i < schedule.length; i++) {
    if (convertTimeToMinutes(formattedTime) < convertTimeToMinutes(schedule[i].time)) {
      schedule.splice(i, 0, newItem);
      inserted = true;
      break;
    }
  }
  if (!inserted) schedule.push(newItem);

  localStorage.setItem('daily-schedule', JSON.stringify(schedule));
  renderSchedule(schedule, document.querySelector('.planner-schedule'));
}

// Edit a schedule item
function editScheduleItem(scheduleItem, itemId) {
  const scheduleContent = scheduleItem.querySelector('.schedule-content');
  const currentContent = scheduleContent.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentContent;
  input.className = 'schedule-edit-input';

  scheduleContent.innerHTML = '';
  scheduleContent.appendChild(input);
  input.focus();

  function saveEdit() {
    const newContent = input.value.trim();
    scheduleContent.textContent = newContent;

    let schedule = JSON.parse(localStorage.getItem('daily-schedule') || '[]');
    const itemIndex = schedule.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      schedule[itemIndex].content = newContent;
      localStorage.setItem('daily-schedule', JSON.stringify(schedule));
    }

    input.removeEventListener('blur', saveEdit);
  }

  input.addEventListener('blur', saveEdit);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveEdit();
  });
}

// Delete a schedule item
function deleteScheduleItem(itemId, container) {
  let schedule = JSON.parse(localStorage.getItem('daily-schedule') || '[]');
  schedule = schedule.filter(item => item.id !== itemId);
  localStorage.setItem('daily-schedule', JSON.stringify(schedule));

  renderSchedule(schedule, container);
}

// Render the daily schedule
function renderSchedule(schedule, container) {
  if (!container) return;
  container.innerHTML = '';

  schedule.forEach(slot => {
    const scheduleItem = document.createElement('div');
    scheduleItem.className = 'schedule-item';
    scheduleItem.setAttribute('data-id', slot.id);

    scheduleItem.innerHTML = `
      <div class="schedule-time">${slot.time}</div>
      <div class="schedule-content">${slot.content}</div>
      <button class="delete-schedule-item" aria-label="Delete">
        🗑️
      </button>
    `;

    container.appendChild(scheduleItem);
  });
}

// Add schedule input form
function addScheduleForm(plannerSchedule) {
  const addScheduleForm = document.createElement('div');
  addScheduleForm.className = 'add-schedule-form';

  addScheduleForm.innerHTML = `
    <div class="time-picker">
      <input type="time" id="schedule-time" class="time-input">
    </div>
    <input type="text" id="schedule-content" placeholder="Add a plan...">
    <button id="add-schedule">Add</button>
  `;

  plannerSchedule.parentNode.insertBefore(addScheduleForm, plannerSchedule);

  document.getElementById('add-schedule').addEventListener('click', () => {
    const scheduleTimeInput = document.getElementById('schedule-time');
    const scheduleContentInput = document.getElementById('schedule-content');

    if (scheduleTimeInput.value && scheduleContentInput.value.trim()) {
      addScheduleItem(scheduleTimeInput.value, scheduleContentInput.value.trim());
      scheduleContentInput.value = '';
    }
  });
}

// Helper function to convert time string to minutes for sorting
function convertTimeToMinutes(timeStr) {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}
