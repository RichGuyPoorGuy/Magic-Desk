// Image upload functionality
document.addEventListener('DOMContentLoaded', () => {
  const imageUpload = document.getElementById('image-upload');
  const saveButton = document.getElementById('save-image');
  const favoriteImage = document.getElementById('favorite-image');
  
  if (imageUpload && saveButton && favoriteImage) {
      // Load saved image if exists
      const savedImage = localStorage.getItem('favorite-image');
      if (savedImage) {
          favoriteImage.src = savedImage;
      }

      // Handle file selection
      imageUpload.addEventListener('change', () => {
          const file = imageUpload.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = function(e) {
                  favoriteImage.src = e.target.result;
                  saveButton.disabled = false;
              };
              reader.readAsDataURL(file);
          }
      });

      // Save image to localStorage
      saveButton.addEventListener('click', () => {
          localStorage.setItem('favorite-image', favoriteImage.src);
          saveButton.disabled = true;
      });
  }
});

// ✅ Now motivational quotes always load, even if favorite image section is removed.
initMotivationalQuotes();

// Initialize motivational quotes
function initMotivationalQuotes() {
  const quotesContainer = document.querySelector('.quotes-container');
  if (!quotesContainer) return;

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

  // Display initial quote
  displayRandomQuote(quotes, quotesContainer);

  // Set up quote rotation
  setInterval(() => {
      displayRandomQuote(quotes, quotesContainer);
  }, 10000); // Change quote every 10 seconds
}

// Display a random quote
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
