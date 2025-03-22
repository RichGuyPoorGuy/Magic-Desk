// Todo list functionality
document.addEventListener('DOMContentLoaded', () => {
    initTodoList();
  });
  
  // Initialize the todo list
  function initTodoList() {
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo');
    const todoList = document.querySelector('.todo-list');
    
    // Load saved todos from localStorage
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    
    // Render saved todos
    savedTodos.forEach(todo => {
      addTodoToDOM(todo.text, todo.completed, todo.id);
    });
    
    // Add event listener for adding new todos
    if (addTodoBtn && todoInput) {
      addTodoBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        if (todoText) {
          const todoId = Date.now().toString();
          
          // Add to DOM
          addTodoToDOM(todoText, false, todoId);
          
          // Save to localStorage
          savedTodos.push({ id: todoId, text: todoText, completed: false });
          localStorage.setItem('todos', JSON.stringify(savedTodos));
          
          // Clear the input
          todoInput.value = '';
        }
      });
      
      // Also listen for Enter key
      todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addTodoBtn.click();
        }
      });
    }
    
    // Add event delegation for todo items
    if (todoList) {
      todoList.addEventListener('click', (e) => {
        // Handle checkbox clicks
        if (e.target.matches('.todo-item-checkbox')) {
          const todoItem = e.target.closest('.todo-item');
          const todoId = todoItem.getAttribute('data-id');
          const isCompleted = e.target.checked;
          
          // Update UI
          if (isCompleted) {
            todoItem.classList.add('completed');
          } else {
            todoItem.classList.remove('completed');
          }
          
          // Update localStorage
          const todos = JSON.parse(localStorage.getItem('todos') || '[]');
          const todoIndex = todos.findIndex(todo => todo.id === todoId);
          if (todoIndex !== -1) {
            todos[todoIndex].completed = isCompleted;
            localStorage.setItem('todos', JSON.stringify(todos));
          }
        }
        
        // Handle delete button clicks
        if (e.target.matches('.todo-item-delete') || e.target.closest('.todo-item-delete')) {
          const todoItem = e.target.closest('.todo-item');
          const todoId = todoItem.getAttribute('data-id');
          
          // Remove from DOM
          todoItem.remove();
          
          // Remove from localStorage
          const todos = JSON.parse(localStorage.getItem('todos') || '[]');
          const updatedTodos = todos.filter(todo => todo.id !== todoId);
          localStorage.setItem('todos', JSON.stringify(updatedTodos));
        }
      });
    }
  }
  
  // Helper function to add a todo item to the DOM
  function addTodoToDOM(text, completed, id) {
    const todoList = document.querySelector('.todo-list');
    if (!todoList) return;
    
    const todoItem = document.createElement('li');
    todoItem.className = `todo-item ${completed ? 'completed' : ''}`;
    todoItem.setAttribute('data-id', id);
    
    todoItem.innerHTML = `
      <input type="checkbox" class="todo-item-checkbox" ${completed ? 'checked' : ''}>
      <span class="todo-item-text">${text}</span>
      <button class="todo-item-delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    
    todoList.appendChild(todoItem);
  }
  