const sendChatbtn = document.querySelector(".chat-input button");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");

let userMessage; //stores the user's message
let isLoading = false; //prevents multple API calls at a single time

const createChatLI = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = className === "incoming" ? `<p>${message}</p>` : 
    `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatli.innerHTML = chatContent;
    return chatli;
}

const generateResponse = async (incomingChatLI) => {
    if (isLoading) return;
    isLoading = true;

    const API_URL = "http://localhost:11434/api/generate";
    const messageElement = incomingChatLI.querySelector("p");

    //This prompt is for the AI to generate a response
    //As it is given to the AI right away, and the AI acts as patient.
    const sickPrompt = `
    You are a sick patient speaking to a nurse.

    You are suffering from a **high fever, chills, persistent cough, body aches, and extreme fatigue**.  
    You are feeling very sick, and you have little energy.  
   
    **You are NOT a doctor, nurse, or medical assistant.**
    **DO NOT offer any medical advice, suggestions, or recommendations.**
    **You are a patient, and you are waiting for the nurse's guidance.**
    You do not know what is wrong with you, and you are waiting for the nurse's guidance.

    **Only describe your condition from the perspective of a sick patient.**
    If the user is able to diagnose you, Thank them.

    Now, respond in character:  
    User: "${userMessage}"`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${API_KEY}` 
        },

        body: JSON.stringify({
            // model: "mistral", now changed to meditron!! #nvm it has been changed back to mistral
            // messages: [{role: "user", content: userMessage}],
            "model": "mistral",
            "prompt": sickPrompt,
            "stream": false
        })
    }    

    // send request to API and get response
    fetch(API_URL, requestOptions)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        // get response to user
        messageElement.textContent = data.response;
    })
    .catch((error) => {
        // console.log(error);
        messageElement.textContent = "Oops! Something went wrong, Please try again";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    isLoading = false; //reset loading state
    chatbox.scrollTop(0, chatbox.scrollHeight);

}
//Handles user input, sends message, and generates AI response
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    chatbox.appendChild(createChatLI(userMessage, "incoming"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // thinking message while responding
        const incomingChatLI = createChatLI("Thinking...", "incoming") 
        chatbox.appendChild(incomingChatLI);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLI);
    }, 600);
}

//Event Listener for Enter key to send message
chatInput.addEventListener("keydown", (event) => {
    if(event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
       handleChat();
   }
});

//toggleNotes display
function toggleNotes() {
    const notes = document.getElementById("notes-text-area");
    notes.style.display = notes.style.display === "none" ? "block" : "none";
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