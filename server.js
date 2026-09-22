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
    console.error(`MongodDB's mongoose failed to connect`, err);
    process.exit(1);
  });

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  timestamp: { type: Date, default: Date.now },
  username: { type: String, required: true, trim: true, maxlength: 100 },
});

const ChatMessage = mongoose.model("ChatMessage", chatSchema);

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("Connected...");
  socket.on("message", (msg) => {
    if (
      !msg ||
      typeof msg !== "object" ||
      typeof msg.message !== "string" ||
      typeof msg.user !== "string"
    ) {
      return;
    }

    const message = msg.message.trim();
    const username = msg.user.trim();

    if (!message || message.length > 2000 || !username || username.length > 100) {
      return;
    }

    const normalizedMessage = {
      user: username,
      message,
    };

    console.log("Received message:", normalizedMessage);

    const chatMessage = new ChatMessage({
      message,
      username,
    });

    chatMessage
      .save()
      .then(() => {
        console.log("Message saved to MongoDB Atlas");
      })
      .catch((err) => {
        console.error("Error saving message to MongoDB Atlas:", err);
      });

    socket.broadcast.emit("message", normalizedMessage);
  });
});

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
