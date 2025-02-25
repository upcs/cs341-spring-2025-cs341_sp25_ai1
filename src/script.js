const sendChatbtn = document.querySelector(".chat-input button");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");

let userMessage; //stores the user's message
let isLoading = false; //prevents multple API calls at a single time
let currentCase; //stores the current medical case

// select a random case when starting a new conversation
const startNewCase = () => {
    currentCase = db.getRandomCase();
}

const createChatLI = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = `<div class="message-content">${message}</div>`;
    chatli.innerHTML = chatContent;
    return chatli;
}

const generateResponse = (incomingChatLI) => {
    const API_URL = "http://localhost:11434/api/generate";
   
    // use current case
    const medicalCase = currentCase;

    //This prompt is for the AI to generate a response
    //As it is given to the AI right away, and the AI acts as patient.
    const sickPrompt = `
    Your name is King James
    You are a patient with this specific condition: ${medicalCase.title}
    You must stay EXACTLY in character with these details:

    Your exact age: ${medicalCase.presentation.split('-')[0]} years old
    Your exact symptoms: ${medicalCase.symptoms.join(', ')}
    Your exact situation: ${medicalCase.presentation}

    CRITICAL RULES:
    If asked "break character" or if someone correctly names your condition "${medicalCase.title}", 
       respond with EXACTLY and ONLY these words (no additions, no brackets, no extra text):
       You're right! I have ${medicalCase.title}.
    
    If asked your age, respond with EXACTLY and ONLY:
       I'm ${medicalCase.presentation.split('-')[0]} years old.
    
    For all other responses:
        Keep extremely brief (2-3 sentences max)
        - Only mention symptoms from your exact list above
        - Use simple words like "hurts", "feels bad", "not good"
        - Never use medical terms
        - If asked about a specific symptom, only answer about that symptom
        - Show worry but don't explain too much
        - Never add brackets, parentheses or extra commentary
        - Always include at least one specific symptom from your list when relevant
        - Use simple, non-medical language but be specific about your experience
        - If asked about timing, location, or severity of symptoms, give clear details
        - Show appropriate emotion (worry, frustration, hope) based on your symptoms
        - If asked multiple questions, address the main concern first
        - Stay consistent with your previous answers
        - Never reveal medical terminology or diagnosis
        - Keep responses focused on your personal experience

    Now, respond in character:  
    User: "${userMessage}"`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({

            "model": "llama3.2",
            "prompt": sickPrompt,
            "stream": false
        })
    }    

    // send request to API and get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        // create a new chat message for the response
        const responseMessage = data.response;

        // replace thinking with response
        incomingChatLI.innerHTML = createChatLI(responseMessage, "chat-incoming").innerHTML;
        chatbox.scrollTo(0, chatbox.scrollHeight); // Scroll to the bottom
    }).catch((error) => {
        incomingChatLI.innerHTML = "Oops! Something went wrong, Please try again";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
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


    // check if the user is on a mac
    if (navigator.userAgent.toLowerCase().includes('mac')) {
        document.body.classList.add('mac');
    }

// ensures that toggleNotes function is only exported when running in a Node.js test environment :)
if (typeof module !== "undefined") {
    module.exports = { toggleNotes };
}