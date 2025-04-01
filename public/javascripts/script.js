const sendChatbtn = document.querySelector(".chat-input button");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
let userMessage; //stores the user's message
let isLoading = false; //prevents multple API calls at a single time
let currentCase; //stores the current medical case
// select a random case when starting a new conversation
const startNewCase = () => {
    console.log("new case");
    $.post( './choose-case', { }, function (response) {
            if (response.length === 0) {
                //if bad request throw error here
            } else {
                // var jsonResponse = JSON.parse(response)
                currentCase = response.case;
            }
        }
    );
}
const createChatLI = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = `<div class="message-content">${message}</div>`;
    chatli.innerHTML = chatContent;
    return chatli;
}
const generateResponse = (incomingChatLI) => {
    $.post( './query', {"query" : userMessage, "collectionName" : currentCase}, function (response) {
            incomingChatLI.innerHTML = createChatLI(response.response, "chat-incoming").innerHTML;
            chatbox.scrollTo(0, chatbox.scrollHeight); // Scroll to the bottom
        }
    );
}
    //handles user input, sends message, and generates AI response
    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if(!userMessage) return;
        chatbox.appendChild(createChatLI(userMessage, "chat-outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        setTimeout(() => {
            // thinking message while responding
            const incomingChatLI = createChatLI("Thinking...", "chat-incoming") 
            chatbox.appendChild(incomingChatLI);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLI);
        }, 300); // time to respond
        chatInput.value = "";
    }
    // when enter key is pressed message is sent
    document.querySelector('.chat-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // call function and reset line
            event.preventDefault();
            handleChat();
        }
    });
    // keyboard shortcut for notes (backtick key)
    document.addEventListener('keydown', (event) => {
        if (event.key === '`' && !document.activeElement.matches('.chat-input textarea')) {
            toggleNotes();
        }
    });
    // get note elements
    const notesBtn = document.querySelector('#notes-btn');
    const notesPanel = document.querySelector('.notes-panel');
    const closeNotesBtn = document.querySelector('.close-btn');
    // hide or unhide notes panel
    function toggleNotes() {
        notesPanel.classList.toggle('hidden');
    }
    // event listeners for notes
    notesBtn.addEventListener('click', toggleNotes);
    closeNotesBtn.addEventListener('click', toggleNotes);
    // make new log
    const newChatBtn = document.querySelector('#new-chat-btn');
    newChatBtn.addEventListener('click', () => {
        // clear messages and add initial message
        chatbox.innerHTML = '';
        chatbox.appendChild(createChatLI("Hello!", "chat-incoming"));
        startNewCase();
    });
    // get case when page loads
    window.onload = () => {
        startNewCase();
    };
// module exports for test files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleNotes: toggleNotes
    }
}