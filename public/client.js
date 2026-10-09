const socket = io();
let name1;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

do {
  name1 = prompt("Please enter your name: ")?.trim();
} while (!name1 || name1.length > 100);

if (!textarea || !messageArea) {
  throw new Error("Chat interface elements are unavailable.");
}

textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    return;
  }

  if (trimmedMessage.length > 2000) {
    alert("Messages must be 2000 characters or fewer.");
    return;
  }

  let msg = {
    user: name1,
    message: trimmedMessage,
  };
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  mainDiv.classList.add(type, "message");

  const userHeading = document.createElement("h4");
  userHeading.textContent = msg.user;

  const messageParagraph = document.createElement("p");
  messageParagraph.textContent = msg.message;

  mainDiv.appendChild(userHeading);
  mainDiv.appendChild(messageParagraph);
  messageArea.appendChild(mainDiv);
}

socket.on("messageError", (error) => {
  const message = typeof error?.message === "string" ? error.message.trim() : "";
  if (!message || message.length > 2000) {
    return;
  }

  appendMessage({ user: "System", message }, "incoming");
  scrollToBottom();
});

socket.on("message", (msg) => {
  if (
    !msg ||
    typeof msg.user !== "string" ||
    typeof msg.message !== "string" ||
    !msg.user.trim() ||
    !msg.message.trim() ||
    msg.user.length > 100 ||
    msg.message.length > 2000
  ) {
    return;
  }

  appendMessage(msg, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
