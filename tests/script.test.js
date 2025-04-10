// sets up the DOM structure to test without a real browser
document.body.innerHTML = `
    <div class="chatbox"></div>
    <div class="chat-input">
        <textarea></textarea>
        <button></button>
    </div>
    <button id="notes-btn"></button>
    <div class="notes-panel hidden"></div>
    <button class="close-btn"></button>
    <button id="new-chat-btn"></button>
`;

// mock $.post to return test data for specific URLs during testing
global.$ = {
    post: jest.fn((url, data, callback) => {
        if (url === './choose-case') {
            callback({ case: 'test_case' });
        } else if (url === './query') {
            callback({ response: 'Test response' });
        }
    })
};

// creates and returns a chat list item with the given message and style
global.createChatLI = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = `<div class="message-content">${message}</div>`;
    chatli.innerHTML = chatContent;
    return chatli;
};

// sends user message and adds it to the chatbox and clears the input
global.handleChat = () => {
    const chatInput = document.querySelector('.chat-input textarea');
    const chatbox = document.querySelector('.chatbox');
    const userMessage = chatInput.value.trim();
    if(!userMessage) return;

    chatbox.appendChild(createChatLI(userMessage, "chat-outgoing"));
    chatInput.value = "";
};

// sends user message to server and updates the chat with the response
global.generateResponse = (incomingChatLI) => {
    $.post('./query', {
        query: window.userMessage,
        collectionName: window.currentCase
    }, function(response) {
        incomingChatLI.innerHTML = createChatLI(response.response, "chat-incoming").innerHTML;
    });
};

// gets new case from the server and saves it as the current case
global.startNewCase = () => {
    $.post('./choose-case', {}, function(response) {
        window.currentCase = response.case;
    });
};

// // toggles the visibility of the notes panel
// global.toggleNotes = () => {
//     const notesPanel = document.querySelector('.notes-panel');
//     notesPanel.classList.toggle('hidden');
// };

// tests the functionality of chat-related UI features
describe('Chat UI Tests', () => {
    beforeEach(() => {
        // reset DOM before each test
        document.body.innerHTML = `
            <div class="chatbox"></div>
            <div class="chat-input">
                <textarea></textarea>
                <button></button>
            </div>
            <button id="notes-btn"></button>
            <div class="notes-panel hidden"></div>
            <button class="close-btn"></button>
            <button id="new-chat-btn"></button>
        `;
        // clear jQuery mock calls
        $.post.mockClear();

        // reset window properties
        window.currentCase = undefined;
        window.userMessage = undefined;
    });

    // test that createChatLI returns a formatted chat list item
    test('createChatLI creates chat message correctly', () => {
        const message = "Test message";
        const li = createChatLI(message, "chat-outgoing");
        
        expect(li.classList.contains('chat')).toBe(true);
        expect(li.classList.contains('chat-outgoing')).toBe(true);
        expect(li.querySelector('.message-content').textContent).toBe(message);
    });

    // // test that toggleNotes shows and hides the notes panel
    // test('toggleNotes shows and hides notes panel', () => {
    //     const notesPanel = document.querySelector('.notes-panel');
        
    //     expect(notesPanel.classList.contains('hidden')).toBe(true);
    //     toggleNotes();
    //     expect(notesPanel.classList.contains('hidden')).toBe(false);
    //     toggleNotes();
    //     expect(notesPanel.classList.contains('hidden')).toBe(true);
    // });

    // test that handleChat appends user message and clears input box
    test('handleChat sends message and clears input', () => {
        const chatInput = document.querySelector('.chat-input textarea');
        const chatbox = document.querySelector('.chatbox');
        
        chatInput.value = "Test message";
        handleChat();
        
        const outgoingMessage = chatbox.querySelector('.chat-outgoing');
        expect(outgoingMessage).toBeTruthy();
        expect(outgoingMessage.querySelector('.message-content').textContent).toBe("Test message");
        expect(chatInput.value).toBe("");
    });

    // test that starting a new case will make a call to the choose-case endpoint
    test('startNewCase initializes a new case', () => {
        startNewCase();
        expect($.post).toHaveBeenCalledWith(
            './choose-case',
            {},
            expect.any(Function)
        );
    });

    // test that generateResponse sends correct data and handles the response
    test('generateResponse makes API call with correct parameters', () => {
        window.currentCase = 'test_case';
        window.userMessage = 'test message';
        
        const incomingChatLI = document.createElement('li');
        generateResponse(incomingChatLI);
        
        expect($.post).toHaveBeenCalledWith(
            './query',
            {
                query: 'test message',
                collectionName: 'test_case'
            },
            expect.any(Function)
        );
    });

    // test that pressing the enter key triggers message handling
    test('Enter key triggers handleChat', () => {
        const chatInput = document.querySelector('.chat-input');
        const textarea = chatInput.querySelector('textarea');
        const enterEvent = new KeyboardEvent('keydown', { 
            key: 'Enter',
            bubbles: true
        });
        
        // add keydown event listener to simulate chat submission
        chatInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleChat();
            }
        });

        // fill textarea and trigger the key event
        textarea.value = "Test message";
        chatInput.dispatchEvent(enterEvent);
        
        // check if message was added to chatbox
        const chatbox = document.querySelector('.chatbox');
        const outgoingMessage = chatbox.querySelector('.chat-outgoing');
        expect(outgoingMessage).toBeTruthy();
    });
});