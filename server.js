const express = require("express");
const app = express();
const http = require("http").createServer(app);
const mongoose = require("mongoose");
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;
const db = process.env.MONGODB_URI;

if (!db) {
  console.error("MONGODB_URI environment variable is required");
  process.exit(1);
}

mongoose
  .connect(db)
  .then(() => {
    console.log(`MongodDB's mongoose is connected`);
  })
  .catch((err) => {
    console.log(`MongodDB's mongoose failed to connect`, err);
  });

// Define a schema for Chat Messages
const chatSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now },
  username: String, // Optionally, include more fields as necessary
});

// Create a model from the schema
const ChatMessage = mongoose.model("ChatMessage", chatSchema);

// Middleware and static files
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Socket.IO handling
io.on("connection", (socket) => {
  console.log("Connected...");
  socket.on("message", (msg) => {
    // Log the received message and broadcast it
    console.log("Received message:", msg);

    // Create a new chat message instance
    const chatMessage = new ChatMessage({
      message: msg.text, // Assuming the message text is in msg.text
      username: msg.username, // Assuming the username is in msg.username
    });

    // Save the message to MongoDB Atlas
    chatMessage
      .save()
      .then(() => {
        console.log("Message saved to MongoDB Atlas");
      })
      .catch((err) => {
        console.error("Error saving message to MongoDB Atlas:", err);
      });

    socket.broadcast.emit("message", msg);
  });
});

// Start server
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
