const socket = io();
let name1 = prompt("Please enter your name: ")?.trim();
if (!name1) {
  name1 = "Guest";
} else if (name1.length > 100) {
  alert("Names must be 100 characters or fewer. Using Guest instead.");
  name1 = "Guest";
}

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

if (!textarea || !messageArea) {
  throw new Error("Chat interface elements are unavailable.");
}

textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && e.isComposing !== true) {
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

  if (!socket.connected) {
    appendMessage(
      { user: "System", message: "Message not sent because chat is disconnected. Please reconnect and try again." },
      "incoming"
    );
    scrollToBottom();
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

  // Keep long-running chats from growing the DOM without bound.
  while (messageArea.children.length > 200) {
    messageArea.firstElementChild.remove();
  }
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

let connectionNoticeShown = false;
socket.on("connect_error", () => {
  if (connectionNoticeShown) {
    return;
  }

  connectionNoticeShown = true;
  appendMessage(
    { user: "System", message: "Unable to connect to chat. Check your connection and try again." },
    "incoming"
  );
  scrollToBottom();
});

socket.on("disconnect", () => {
  if (connectionNoticeShown) {
    return;
  }

  connectionNoticeShown = true;
  appendMessage(
    { user: "System", message: "Connection to chat was lost. Reconnecting…" },
    "incoming"
  );
  scrollToBottom();
});

socket.on("connect", () => {
  connectionNoticeShown = false;
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
