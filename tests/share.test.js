/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the actual HTML file with path.resolve
let html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');

// Convert RGB to Hex
function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g);
    return '#' + [r, g, b].map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

beforeEach(() => {
    document.documentElement.innerHTML = html;

    // Mock jQuery since it's used in the HTML
    global.$ = jest.fn(() => ({
        post: jest.fn()
    }));

    // Mock html2pdf
    html2pdfMock = {
        from: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        save: jest.fn()
    };
    global.html2pdf = jest.fn(() => html2pdfMock);

    // Mock window.prompt
    mockPrompt = jest.spyOn(window, 'prompt');

    // Get DOM elements after HTML is set up
    sharePdfBtn = document.getElementById('sharePdfBtn');
    exportConfirm = document.getElementById('exportConfirm');
    confirmYes = document.getElementById('confirmYes');
    confirmNo = document.getElementById('confirmNo');

    // Load and execute the script directly
    const scriptContent = fs.readFileSync(path.resolve(__dirname, '../public/javascripts/share.js'), 'utf8');
    eval(scriptContent);

    // Manually trigger DOMContentLoaded to ensure event listeners are attached
    document.dispatchEvent(new Event('DOMContentLoaded'));
});

afterEach(() => {
    jest.clearAllMocks();
    // Clean up jQuery mock
    delete global.$;
});

describe('Export PDF UI Interactions', () => {
    test('Export button toggles confirmation flap', () => {
        // Create and dispatch click event
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        sharePdfBtn.dispatchEvent(clickEvent);
        expect(exportConfirm.classList.contains('show')).toBe(true);

        sharePdfBtn.dispatchEvent(clickEvent);
        expect(exportConfirm.classList.contains('show')).toBe(false);
    });

    test('Clicking outside closes confirmation flap', () => {
        // Ensure flap is closed
        expect(exportConfirm.classList.contains('show')).toBe(false);
        
        // manually open the flap
        exportConfirm.classList.add('show');
        
        // Verify flap is open
        expect(exportConfirm.classList.contains('show')).toBe(true);

        // Click outside - this should close the flap
        const outsideClick = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        
        // Click on the body element to simulate clicking outside
        document.body.dispatchEvent(outsideClick);
        
        // Verify flap is closed
        expect(exportConfirm.classList.contains('show')).toBe(false);
    });

    test('No button closes confirmation flap', () => {
        // Open the flap
        sharePdfBtn.dispatchEvent(new MouseEvent('click'));
        expect(exportConfirm.classList.contains('show')).toBe(true);

        // Click No
        confirmNo.dispatchEvent(new MouseEvent('click'));
        expect(exportConfirm.classList.contains('show')).toBe(false);
    });
});

describe('PDF Filename Handling', () => {
    test('Yes button prompts for filename', () => {
        mockPrompt.mockReturnValue('test_file');
        confirmYes.dispatchEvent(new MouseEvent('click'));
        expect(mockPrompt).toHaveBeenCalledWith('Enter file name', 'chat_conversation');
    });

    test('PDF generation with custom filename', () => {
        mockPrompt.mockReturnValue('test_file');
        confirmYes.dispatchEvent(new MouseEvent('click'));

        expect(html2pdf).toHaveBeenCalled();
        expect(html2pdfMock.set).toHaveBeenCalledWith({
            margin: 5,
            filename: 'test_file.pdf',
            jsPDF: { orientation: 'landscape' }
        });
    });

    test('PDF generation with default filename when empty input', () => {
        mockPrompt.mockReturnValue('');
        confirmYes.dispatchEvent(new MouseEvent('click'));

        expect(html2pdf).toHaveBeenCalled();
        expect(html2pdfMock.set).toHaveBeenCalledWith({
            margin: 5,
            filename: 'chat_conversation.pdf',
            jsPDF: { orientation: 'landscape' }
        });
    });

    test('No PDF generation when cancel clicked', () => {
        mockPrompt.mockReturnValue(null);
        confirmYes.dispatchEvent(new MouseEvent('click'));

        expect(html2pdf).not.toHaveBeenCalled();
        expect(exportConfirm.classList.contains('show')).toBe(false);
    });
});

describe('PDF Content and Styling', () => {
    test('PDF includes chat messages with correct styling', () => {
        // Get the chatbox and add test messages using the existing HTML structure
        const chatbox = document.querySelector('.chatbox');
        
        // Add a bot message
        const botMessage = document.createElement('li');
        botMessage.className = 'chat chat-incoming';
        botMessage.innerHTML = '<div class="message-content">Bot message</div>';
        
        //Add a user message
        const userMessage = document.createElement('li');
        userMessage.className = 'chat chat-outgoing';
        userMessage.innerHTML = '<div class="message-content">User message</div>';
        
        // Add messages to chatbox while preserving existing welcome message
        chatbox.appendChild(botMessage);
         chatbox.appendChild(userMessage);

        mockPrompt.mockReturnValue('test_file');
        confirmYes.dispatchEvent(new MouseEvent('click'));

        const container = html2pdfMock.from.mock.calls[0][0];
        
        // Check bot message styling
        const botMessages = container.querySelectorAll('.chat-incoming .message-content');
        expect(botMessages[1].style.backgroundColor).toBe('white');
        expect(botMessages[1].style.color).toBe('black');
        expect(botMessages[1].style.border).toBe('1px solid gainsboro');

         // Check user message styling - convert rgb to hex for comparison
        const userMessages = container.querySelectorAll('.chat-outgoing .message-content');
        const rgbColor = getComputedStyle(userMessages[0]).backgroundColor;
        const hexColor = rgbToHex(rgbColor);
        expect(hexColor.toLowerCase()).toBe('#4835c4');
        expect(userMessages[0].style.color).toBe('white');
    });

    test('PDF includes notes when they exist', () =>{
        // Create and set up notes area
        let notesArea = document.getElementById('notes-text-area');
        if (!notesArea) {
            notesArea = document.createElement('textarea');
            notesArea.id = 'notes-text-area';
            document.body.appendChild(notesArea);
        }
        
        //add test notes
        notesArea.value = 'Test notes';

        // PDF generation
        mockPrompt.mockReturnValue('test_file');
        confirmYes.dispatchEvent(new MouseEvent('click'));

        // Container passed to html
        const container = html2pdfMock.from.mock.calls[0][0];
    
        //get notes div
        const notesDiv = Array.from(container.children).find(child => 
            child.tagName === 'DIV' && !child.classList.contains('chatbox')
        );
        
        expect(notesDiv).toBeTruthy();
        expect(notesDiv.querySelector('h3')).toBeTruthy();
        expect(notesDiv.querySelector('h3').textContent).toBe('Notes');
        expect(notesDiv.querySelector('div')).toBeTruthy();
        expect(notesDiv.querySelector('div').textContent).toBe('Test notes');
         expect(notesDiv.querySelector('div').style.whiteSpace).toBe('pre-wrap');
     });
}); 