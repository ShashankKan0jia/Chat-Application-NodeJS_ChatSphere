const socket = io();
let name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");




do {
  name1 = prompt("Please enter your name: ");
} while (!name1);

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
    

  }
});


function sendMessage(message) {
  let msg = {
    user: name1,
    message: message.trim(),
  };
  // Append
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Send to server
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  const userHeading = document.createElement("h4");
  userHeading.textContent = msg.user;

  const messageParagraph = document.createElement("p");
  messageParagraph.textContent = msg.message;

  mainDiv.appendChild(userHeading);
  mainDiv.appendChild(messageParagraph);
  messageArea.appendChild(mainDiv);
}

// Recieve messages
socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
