// settings functionality
const settingsBtn = document.getElementById('settings-btn');
const popupOverlay = document.getElementById('popupOverlay');
const decreaseFont = document.getElementById('decreaseFont');
const increaseFont = document.getElementById('increaseFont');
const fontSizeDisplay = document.getElementById('fontSizeDisplay');
const themeToggle = document.getElementById('themeToggle');

// popup is hidden initially
popupOverlay.style.display = 'none';

// open and close settings popup
settingsBtn.addEventListener('click', () => {
    // Toggle visibility
    if (popupOverlay.style.display === 'none') {
        popupOverlay.style.display = 'flex';
    } else {
        popupOverlay.style.display = 'none';
    }
});

// close popup when clicking outside
popupOverlay.addEventListener('click', (event) => {
    if (event.target === popupOverlay) {
        popupOverlay.style.display = 'none';
    }
});