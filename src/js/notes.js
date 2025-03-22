document.addEventListener('DOMContentLoaded', () => {
  initNotes();
});

function initNotes() {
  const notesList = document.querySelector('.notes-list');
  const noteContent = document.getElementById('note-content');
  const addNoteButton = document.getElementById('add-note');
  const colorButtons = document.querySelectorAll('.color-btn');
  const modal = document.getElementById('note-modal');
  const modalText = document.getElementById('modal-text');
  const modalClose = document.getElementById('note-modal-close');

  const notesState = {
    selectedColor: localStorage.getItem('selected-note-color') || '#ffffcc'
  };

  const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');

  savedNotes.forEach(note => {
    addNoteToDOM(note.id, note.content, note.color);
  });

  if (colorButtons) {
    colorButtons.forEach(button => {
      const color = button.getAttribute('data-color');
      if (color === notesState.selectedColor) {
        button.classList.add('selected');
      }

      const checkIcon = document.createElement('span');
      checkIcon.className = 'check-icon';
      checkIcon.innerHTML = '✅';
      button.appendChild(checkIcon);

      if (color === notesState.selectedColor) {
        checkIcon.style.display = 'block';
      } else {
        checkIcon.style.display = 'none';
      }
    });
  }

  if (addNoteButton && noteContent) {
    addNoteButton.addEventListener('click', () => {
      const content = noteContent.value.trim();
      if (content) {
        const noteId = Date.now().toString();
        addNoteToDOM(noteId, content, notesState.selectedColor);
        savedNotes.push({ id: noteId, content, color: notesState.selectedColor });
        localStorage.setItem('notes', JSON.stringify(savedNotes));
        noteContent.value = '';
      }
    });
  }

  if (colorButtons) {
    colorButtons.forEach(button => {
      button.style.backgroundColor = button.getAttribute('data-color');
      button.addEventListener('click', () => {
        colorButtons.forEach(btn => {
          btn.classList.remove('selected');
          const checkIcon = btn.querySelector('.check-icon');
          if (checkIcon) {
            checkIcon.style.display = 'none';
          }
        });

        button.classList.add('selected');
        const checkIcon = button.querySelector('.check-icon');
        if (checkIcon) {
          checkIcon.style.display = 'block';
        }

        notesState.selectedColor = button.getAttribute('data-color');
        localStorage.setItem('selected-note-color', notesState.selectedColor);
      });
    });
  }

  if (notesList) {
    notesList.addEventListener('click', (e) => {
      const noteItem = e.target.closest('.note-item');
      if (noteItem && !e.target.closest('.note-item-delete')) {
        const noteText = noteItem.querySelector('.note-item-content').innerText;
        modalText.innerText = noteText;
        modal.style.display = 'flex';
      }
    });

    notesList.addEventListener('click', (e) => {
      if (e.target.matches('.note-item-delete') || e.target.closest('.note-item-delete')) {
        const noteItem = e.target.closest('.note-item');
        const noteId = noteItem.getAttribute('data-id');
        noteItem.remove();

        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        const updatedNotes = notes.filter(note => note.id !== noteId);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

function addNoteToDOM(id, content, color) {
  const notesList = document.querySelector('.notes-list');
  if (!notesList) return;

  const noteItem = document.createElement('div');
  noteItem.className = 'note-item';
  noteItem.setAttribute('data-id', id);
  noteItem.style.backgroundColor = color;

  noteItem.innerHTML = `
    <div class="note-item-content">${content}</div>
    <button class="note-item-delete">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  notesList.appendChild(noteItem);
}
