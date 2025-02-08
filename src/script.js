const sendChatbtn = document.querySelector(".chat-input button");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");

let userMessage;

const createChatLI = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatli.innerHTML = chatContent;
    return chatli;
}

const generateResponse = (incomingChatLI) => {
    const API_URL = "http://localhost:11434/api/generate";
    const messageElement = incomingChatLI.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${API_KEY}` 
        },
        body: JSON.stringify({
            // model: "mistral",
            // messages: [{role: "user", content: userMessage}],
            "model": "mistral",
            "prompt": userMessage,
            "stream": false
        })
    }

    // send request to API and get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        // console.log(data);
        // get response yo user
        messageElement.textContent = data.response;
    }).catch((error) => {
        // console.log(error);
        messageElement.textContent = "Oops! Something went wrong, Please try again";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));

}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    chatbox.appendChild(createChatLI(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // thinking message while responding
        const incomingChatLI = createChatLI("Thinking...", "outgoing") 
        chatbox.appendChild(incomingChatLI);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLI);
    }, 600);
}

function toggleNotes() {
    var notes = document.getElementById("notes-text-area");
    if(notes.style.display === "none") {
        notes.style.display = "block";
    } else {
        notes.style.display = "none";
    }
}

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