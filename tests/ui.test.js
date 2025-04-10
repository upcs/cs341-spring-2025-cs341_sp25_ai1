// tests for chat ui components

/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the actual HTML file with path.resolve
let html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');

// setup the document with the HTML before each test
beforeEach(() => {
  document.documentElement.innerHTML = html;
});

describe('ui components', () => {
  test('sidebar should contain expected elements', () => {
    const sidebar = document.querySelector('.sidebar');
    expect(sidebar).not.toBeNull();
    
    const header = sidebar.querySelector('.sidebar-header h1');
    expect(header).not.toBeNull();
    expect(header.textContent).toBe('AI ChatBot');
    
    const newChatBtn = sidebar.querySelector('#new-chat-btn');
    expect(newChatBtn).not.toBeNull();
    expect(newChatBtn.textContent).toBe('+ New Chat');

    
    const settingsBtn = sidebar.querySelector('#settings-btn');
    expect(settingsBtn).not.toBeNull();
    expect(settingsBtn.textContent).toBe('⚙️ Settings');
  });
  
  test('chat area should contain expected elements', () => {
    const chatArea = document.querySelector('.chat-area');
    expect(chatArea).not.toBeNull();
    
    const chatbox = chatArea.querySelector('.chatbox');
    expect(chatbox).not.toBeNull();
    
    const chatInput = chatArea.querySelector('.chat-input textarea');
    expect(chatInput).not.toBeNull();
    expect(chatInput.getAttribute('placeholder')).toBe('Type your message...');
    
    const sendButton = chatArea.querySelector('.chat-input button');
    expect(sendButton).not.toBeNull();
    expect(sendButton.textContent).toBe('↑');
  });
  
  test('initial chatbox should contain welcome message', () => {
    const chatbox = document.querySelector('.chatbox');
    const initialMessage = chatbox.querySelector('.chat-incoming');
    
    expect(initialMessage).not.toBeNull();
    expect(initialMessage.querySelector('.message-content').textContent.trim()).toBe('Hello!');
  });
  
  test('settings popup should contain expected elements', () => {
    const popupOverlay = document.querySelector('#popupOverlay');
    expect(popupOverlay).not.toBeNull();
    expect(popupOverlay.classList.contains('popup-overlay')).toBe(true);
    
    const popup = popupOverlay.querySelector('.popup');
    expect(popup).not.toBeNull();
    
    // Font size controls
    const fontControls = popup.querySelector('.font-controls');
    expect(fontControls).not.toBeNull();
    
    const decreaseBtn = fontControls.querySelector('#decreaseFont');
    expect(decreaseBtn).not.toBeNull();
    expect(decreaseBtn.textContent).toBe('-');
    
    const fontSizeDisplay = fontControls.querySelector('#fontSizeDisplay');
    expect(fontSizeDisplay).not.toBeNull();
    expect(fontSizeDisplay.textContent).toBe('16px');
    
    const increaseBtn = fontControls.querySelector('#increaseFont');
    expect(increaseBtn).not.toBeNull();
    expect(increaseBtn.textContent).toBe('+');
    
    // Toggle theme
    const themeToggle = popup.querySelector('.theme-toggle');
    expect(themeToggle).not.toBeNull();
    
     const toggleSwitch = themeToggle.querySelector('#themeToggle');
     expect(toggleSwitch).not.toBeNull();
     expect(toggleSwitch.type).toBe('checkbox');
    
     const themeLabels = themeToggle.querySelectorAll('span');
     expect(themeLabels.length).toBe(3); // Two text labels and one slider span
     expect(themeLabels[0].textContent).toBe('Light');
     expect(themeLabels[2].textContent).toBe('Dark');
  });
}); 