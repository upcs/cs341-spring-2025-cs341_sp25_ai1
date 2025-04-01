// settings functionality
const settingsBtn = document.getElementById('settings-btn');
const popupOverlay = document.getElementById('popupOverlay');
const decreaseFont = document.getElementById('decreaseFont');
const increaseFont = document.getElementById('increaseFont');
const fontSizeDisplay = document.getElementById('fontSizeDisplay');
const themeToggle = document.getElementById('themeToggle');

// get saved settings
let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 16;
let isDarkTheme = localStorage.getItem('darkTheme') === 'true';

// apply initial settings
document.body.style.fontSize = `${currentFontSize}px`;
fontSizeDisplay.textContent = `${currentFontSize}px`;

//apply dark theme if saved
if (isDarkTheme) {
    document.body.classList.add('dark-theme');
    themeToggle.checked = true;
}

// popup is hidden initially
popupOverlay.style.display = 'none';

// open and close settings popup
settingsBtn.addEventListener('click', () => {
    // Toggle visibility
    if (popupOverlay.style.display === 'none') {
        popupOverlay.style.display = 'flex';
    } 
    else {
        popupOverlay.style.display = 'none';
    }
});

// close popup when clicking outside
popupOverlay.addEventListener('click', (event) => {
    if (event.target === popupOverlay) {
        popupOverlay.style.display = 'none';
    }
});

// font size controls
decreaseFont.addEventListener('click', () => {
    if (currentFontSize > 12) {
        currentFontSize--;
        updateFontSize();
    }
});

increaseFont.addEventListener('click', () => {
    if (currentFontSize < 24) {
        currentFontSize++;
        updateFontSize();
    }
});

function updateFontSize() {
    document.body.style.fontSize =`${currentFontSize}px`;
    fontSizeDisplay.textContent = `${currentFontSize}px`;
    localStorage.setItem('fontSize', currentFontSize);
}

//toggle theme
themeToggle.addEventListener('change', () => {
    isDarkTheme = themeToggle.checked;
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
    } 
    else{
        document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('darkTheme', isDarkTheme);
});
