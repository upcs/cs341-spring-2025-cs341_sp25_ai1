/**
 * @jest-environment jsdom
 */

// Import necessary modules
const fs = require('fs');
const path = require('path');

// Mock localStorage with actual Jest mock functions
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Settings', () => {
  let settingsBtn;
  let popupOverlay;
  let popup;
  let decreaseFont;
  let increaseFont;
  let fontSizeDisplay;
  let themeToggle;
  
  // Helper function to load settings.js with given localStorage values
  const loadSettingsWithMock = (fontSizeValue, darkTheme) => {
    jest.clearAllMocks();
    document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');
    
    localStorageMock.getItem.mockImplementation(key => {
      if (key === 'fontSize') return fontSizeValue;
      if (key === 'darkTheme') return darkTheme;
      return null;
    });
    
    jest.isolateModules(() => { require('../public/javascripts/settings.js'); });
    
    return {
      settingsBtn: document.getElementById('settings-btn'),
      popupOverlay: document.getElementById('popupOverlay'),
      popup: document.querySelector('.popup'),
      decreaseFont: document.getElementById('decreaseFont'),
      increaseFont: document.getElementById('increaseFont'),
      fontSizeDisplay: document.getElementById('fontSizeDisplay'),
      themeToggle: document.getElementById('themeToggle')
    };
  };
  
  beforeEach(() => {
    const elements = loadSettingsWithMock('16', 'false');
    ({settingsBtn, popupOverlay, popup, decreaseFont, increaseFont, fontSizeDisplay, themeToggle} = elements);
    popupOverlay.style.display = 'none';
  });
  
  // Popup tests
  test.each([
    ['toggles when button clicked', () => {
      expect(popupOverlay.style.display).toBe('none');
      settingsBtn.click();
      expect(popupOverlay.style.display).toBe('flex');
      settingsBtn.click();
      expect(popupOverlay.style.display).toBe('none');
    }],
    ['stays open when clicking inside', () => {
      popupOverlay.style.display = 'flex';
      popup.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(popupOverlay.style.display).toBe('flex');
    }],
    ['closes when clicking outside', () => {
      popupOverlay.style.display = 'flex';
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: popupOverlay });
      popupOverlay.dispatchEvent(clickEvent);
      expect(popupOverlay.style.display).toBe('none');
    }]
  ])('Popup %s', (_, fn) => fn());
  
  // Theme toggle test
  test('theme toggle switches between light and dark', () => {
    expect(document.body.classList.contains('dark-theme')).toBe(false);
    
    themeToggle.checked = true;
    themeToggle.dispatchEvent(new Event('change'));
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('darkTheme', true);
    
    themeToggle.checked = false;
    themeToggle.dispatchEvent(new Event('change'));
    expect(document.body.classList.contains('dark-theme')).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('darkTheme', false);
  });
  
  // Initialization tests
  test.each([
    ['font size', '18', elements => {
      expect(elements.fontSizeDisplay.textContent).toBe('18px');
      expect(document.body.style.fontSize).toBe('18px');
    }],
    ['theme', 'true', elements => {
      expect(document.body.classList.contains('dark-theme')).toBe(true);
      expect(elements.themeToggle.checked).toBe(true);
    }]
  ])('loads saved %s from localStorage', (setting, value, assertions) => {
    const darkTheme = setting === 'theme' ? value : 'false';
    const fontSize = setting === 'font size' ? value : '16';
    const elements = loadSettingsWithMock(fontSize, darkTheme);
    assertions(elements);
  });
  
  // Font size tests
  describe('Font size operations', () => {
    test.each([
      ['decrease', 16, 15, 'decreaseFont', true],
      ['increase', 16, 17, 'increaseFont', true],
      ['decrease at min', 12, 12, 'decreaseFont', false],
      ['increase at max', 24, 24, 'increaseFont', false]
    ])('%s font size (from %s to %s)', (op, initial, expected, btnId, shouldChange) => {
      const elements = loadSettingsWithMock(initial.toString(), 'false');
      
      jest.clearAllMocks();
      localStorageMock.getItem.mockImplementation(key => 
        key === 'fontSize' ? initial.toString() : null
      );
      
      elements[btnId].click();
      
      expect(elements.fontSizeDisplay.textContent).toBe(`${expected}px`);
      expect(document.body.style.fontSize).toBe(`${expected}px`);
      
      if (shouldChange) {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('fontSize', expected);
      } else {
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
      }
    });
  });
}); 