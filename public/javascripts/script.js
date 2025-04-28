//UI selectors for manipulating content in-code
const sendChatbtn = document.querySelector(".chat-input button");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
let userMessage; //stores the user's message
let isLoading = false; //prevents multple API calls at a single time
let currentCase; //stores the current medical case

// start new case should be called when a new random case is needed
//makes a simple post request 
const startNewCase = () => {
    console.log("new case");
    $.post( './choose-case', { }, function (response) {
            if (response.length === 0) {
                //TODO throw error here
            } else {
                currentCase = response.case;
            }
        }
    );
}

//creates a new html list element in the chat-box, which has a class specified by the caller
const createChatLI = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = `<div class="message-content">${message}</div>`;
    chatli.innerHTML = chatContent;
    return chatli;
}

//use the incoming chat from the user window to query the express server
const generateResponse = (incomingChatLI) => {
    //this post request sends a JSON object with the user content query as well as the current active case as strings
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

//evet listener code
document.addEventListener('DOMContentLoaded', function() {
    const notes = document.getElementById('notes-text-area');
    
    if (notes) {
        // Add initial bullet point if empty
        if (!notes.value) {
            notes.value = '- ';
        }
        
        // Handle keypresses
        notes.addEventListener('keydown', function(e) {
            // Dont delete first bullet point
            if ((e.key === 'Backspace' || e.key === 'Delete') && (this.selectionStart <= 2)) {
                e.preventDefault();
                return;
            }
            
            // new point when enter is pressed
            if (e.key === 'Enter') {
                e.preventDefault();
                const pos = this.selectionStart;
                this.value = this.value.substring(0, pos) + '\n- ' + this.value.substring(pos);
                this.selectionStart = pos + 3;
                this.selectionEnd = pos + 3;    
            }
        });
        
        // Check if first line needs bullet point
        notes.addEventListener('input', function() {
            if (!this.value.startsWith('- ')) {
                this.value = '- ' + this.value;
                this.selectionStart = Math.min(this.selectionStart + 2, this.value.length);
                this.selectionEnd = this.selectionStart;
            }
        });
    }
}); 

// module exports for test files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleNotes: toggleNotes
    }
}