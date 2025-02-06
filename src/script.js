function toggleNotes() {
    var notes = document.getElementById("notes-text-area");
    if(notes.style.display === "none") {
        notes.style.display = "block";
    } else {
        notes.style.display = "none";
    }
}

function send() {
    var input = document.querySelector(".chat-input textarea");
    var message = input.value;
    input.value = "";
    if (message === "") {
        return;
    }
    var chatbox = document.querySelector(".chatbox");
    var message = document.createElement("li");
    message.classList.add("chat-outgoing");
    message.classList.add("chat");
    message.innerHTML = "<p>" + message + "</p>";
    chatbox.appendChild(message);
    chatbox.scrollTop = chatbox.scrollHeight;
}