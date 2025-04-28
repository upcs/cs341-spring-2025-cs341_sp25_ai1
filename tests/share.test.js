/**
 * @jest-environment jsdom
 */

// Import necessary modules
const fs = require('fs');
const path = require('path');

// Mock html2pdf
global.html2pdf = jest.fn().mockReturnValue({
  from: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      save: jest.fn()
    })
  })
});

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Setup DOM with content from index.html
document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');

// Mock other functions
window.prompt = jest.fn();

// Directly require the share.js module with explicit path for coverage tracking
require('../public/javascripts/share.js');

// Keep track of the exported functions from the share.js module
const shareFunctions = require('../public/javascripts/share.js');

describe('Share PDF functionality', () => {
  let sharePdfBtn;
  let exportConfirm;
  let confirmYes;
  let confirmNo;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Reset DOM
    document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');
    
    // Get DOM elements
    sharePdfBtn = document.getElementById('sharePdfBtn');
    exportConfirm = document.getElementById('exportConfirm');
    confirmYes = document.getElementById('confirmYes');
    confirmNo = document.getElementById('confirmNo');
    
    // Trigger DOMContentLoaded to initialize event listeners
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });
  
  // UI Interaction Tests
  test.each([
    ['toggleExportFlap toggles visibility', () => {
      expect(exportConfirm.classList.contains('show')).toBe(false);
      
      // First toggle - show
      const toggle = shareFunctions?.toggleExportFlap || (() => sharePdfBtn.click());
      toggle();
      expect(exportConfirm.classList.contains('show')).toBe(true);
      
      // Second toggle - hide
      toggle();
      expect(exportConfirm.classList.contains('show')).toBe(false);
    }],
    ['clicking inside keeps flap visible', () => {
      sharePdfBtn.click();
      exportConfirm.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(exportConfirm.classList.contains('show')).toBe(true);
    }],
    ['clicking outside closes flap', () => {
      sharePdfBtn.click();
      const clickEvent = new MouseEvent('click', { bubbles: true });
      
      if (shareFunctions?.handleOutsideClick) {
        shareFunctions.handleOutsideClick(clickEvent);
      } else {
        document.body.dispatchEvent(clickEvent);
      }
      
      expect(exportConfirm.classList.contains('show')).toBe(false);
    }],
    ['confirmNo closes flap', () => {
      sharePdfBtn.click();
      
      if (shareFunctions?.handleConfirmNo) {
        shareFunctions.handleConfirmNo();
      } else {
        confirmNo.click();
      }
      
      expect(exportConfirm.classList.contains('show')).toBe(false);
    }]
  ])('%s', (_, fn) => fn());

  // Filename Handling Tests
  test.each([
    ['null prompt cancels export', null, false, null],
    ['empty filename uses default', '   ', true, 'chat_conversation.pdf'],
    ['custom filename is used', 'my_chat', true, 'my_chat.pdf']
  ])('handleConfirmYes with %s', (_, promptValue, shouldCall, expectedFilename) => {
    sharePdfBtn.click();
    window.prompt.mockReturnValueOnce(promptValue);
    
    if (shareFunctions?.handleConfirmYes) {
      shareFunctions.handleConfirmYes();
    } else {
      confirmYes.click();
    }
    
    expect(exportConfirm.classList.contains('show')).toBe(false);
    
    if (shouldCall) {
      expect(global.html2pdf().from().set).toHaveBeenCalledWith(
        expect.objectContaining({ filename: expectedFilename })
      );
    } else {
      expect(global.html2pdf).not.toHaveBeenCalled();
    }
  });

  // Content Tests
  test('PDF export includes notes and styled messages', () => {
    // Setup notes
    const notesArea = document.getElementById('notes-text-area');
    notesArea.value = 'Test notes content';
    
    // Add chat messages
    const chatbox = document.querySelector('.chatbox');
    ['chat-incoming', 'chat-outgoing'].forEach(type => {
      const li = document.createElement('li');
      li.className = `${type} chat`;
      const msg = document.createElement('div');
      msg.className = 'message-content';
      msg.textContent = `${type} message`;
      li.appendChild(msg);
      chatbox.appendChild(li);
    });
    
    // Generate PDF
    const saveFunction = shareFunctions?.saveConversationAsPdf || 
      (() => { sharePdfBtn.click(); window.prompt.mockReturnValueOnce('test'); confirmYes.click(); });
    
    if (typeof saveFunction === 'function') saveFunction('test.pdf');
    else saveFunction();
    
    // Verify content
    expect(global.html2pdf().from).toHaveBeenCalled();
    const exportContainer = global.html2pdf().from.mock.calls[0][0];
    
    // Verify that the export container contains both chat and notes content
    expect(exportContainer.textContent).toContain('chat-incoming message');
    expect(exportContainer.textContent).toContain('chat-outgoing message');
    expect(exportContainer.textContent).toContain('Test notes content');
    
    // Verify PDF generation options
    expect(global.html2pdf().from().set).toHaveBeenCalledWith(
      expect.objectContaining({
        filename: expect.any(String),
        jsPDF: { orientation: 'landscape' }
      })
    );
  });
}); 