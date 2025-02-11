const sendChatbtn = document.querySelector(".chat-input button");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");

let userMessage;

const createChatLI = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = `<p>${message}</p>`;
    chatli.innerHTML = chatContent;
    return chatli;
}

const generateResponse = (incomingChatLI) => {
    // to run LLM must download ollama: https://ollama.com/download and do ollama pull mistral in terminal
    const API_URL = "http://localhost:11434/api/generate";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "model": "mistral",
            "prompt": userMessage,
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
}

function toggleNotes() {
    var notes = document.getElementById("notes-text-area");
    if(notes.style.display === "none") {
        notes.style.display = "block";
    } else {
        notes.style.display = "none";
    }
}

// when enter key is pressed message is sent
document.querySelector('.chat-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        // call function and reset line
        event.preventDefault();
        handleChat();
        chatInput.value = "";
    }
  });

  // shortcut key to toggle notes
document.addEventListener("keydown", function(event) {
        // don't toggle notes if user is in chat box
        if (document.activeElement.matches('.chat-input textarea')) {
            return;
        }
        
        // open notes
        if (event.key === "`") {
            toggleNotes();
        }
});

// function send() {
//     var input = document.querySelector(".chat-input textarea");
//     var message = input.value;
//     input.value = "";
//     if (message === "") {
//         return;
//     }
//     var chatbox = document.querySelector(".chatbox");
//     var message = document.createElement("li");
//     message.classList.add("chat-outgoing");
//     message.classList.add("chat");
//     message.innerHTML = "<p>" + message + "</p>";
//     chatbox.appendChild(message);
//     chatbox.scrollTop = chatbox.scrollHeight;
// }