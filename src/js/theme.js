// Theme switcher functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeSelector = document.getElementById('theme-selector');
  const themeButton = document.getElementById('theme-button');
  
  // Add event listener for theme toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  
  // Initialize theme button and selector
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const themePopup = document.getElementById('theme-popup');
      themePopup.classList.toggle('show');
    });
    
    // Close theme popup when clicking outside
    document.addEventListener('click', (e) => {
      const themePopup = document.getElementById('theme-popup');
      if (themePopup && !themeButton.contains(e.target) && !themePopup.contains(e.target)) {
        themePopup.classList.remove('show');
      }
    });
  }
  
  // Initialize theme selector if it exists
  if (themeSelector) {
    const predefinedThemes = [
      
      { name: 'light', label: 'Light' },
      { name: 'dark', label: 'Dark' },
      { name: 'purple', label: 'Lavender' },
      { name: 'blue', label: 'Ocean Blue' },
      { name: 'green', label: 'Fresh Mint' },
      { name: 'orange', label: 'Sunset' },
      { name: 'dark-blue', label: 'Night Sky' }
    ];
    
    // Create theme swatches
    predefinedThemes.forEach(theme => {
      const swatch = document.createElement('div');
      swatch.className = `theme-swatch ${theme.name}-swatch`;
      swatch.setAttribute('data-theme', theme.name);
      swatch.title = theme.label;
      
      // Add active class to current theme
      if (theme.name === appState.theme) {
        swatch.classList.add('active');
      }
      
      swatch.addEventListener('click', () => {
        changeTheme(theme.name);
        // Remove active class from all swatches
        document.querySelectorAll('.theme-swatch').forEach(s => {
          s.classList.remove('active');
        });
        // Add active class to clicked swatch
        swatch.classList.add('active');
        
        // Hide theme popup
        document.getElementById('theme-popup').classList.remove('show');
      });
      
      themeSelector.appendChild(swatch);
    });
    
// Change to a specific theme
  function changeTheme(themeName) {
    // Remove all existing theme classes
    document.body.classList.remove(
      'dark-theme',
      'theme-purple',
      'theme-blue',
      'theme-green',
      'theme-orange',
      'theme-dark-blue'
    );
    
    // Add the selected theme class
    if (themeName === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (themeName !== 'default' && themeName !== 'light') {
      document.body.classList.add(`theme-${themeName}`);
    }
    
    // Save the theme preference
    localStorage.setItem('theme', themeName);
    appState.theme = themeName;
  }
  }
});
  
  
