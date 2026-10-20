# ChatSphere

A real-time messaging application built with Node.js and Socket.io.

## Features
- Real-time messaging without page reloads
- Username normalization and validation
- Incoming message validation
- Message-length constraints
- Browser-based chat interface

## Stack
Node.js, Express, Socket.io, HTML/CSS/JavaScript.

## Run locally

1. Install Node.js and MongoDB Atlas (or another MongoDB instance).
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set `MONGODB_URI` to your MongoDB connection string in the environment. The server exits at startup if this variable is missing.
4. Start the server:
   ```sh
   npm start
   ```
5. Open `http://localhost:3000` in your browser. Set `PORT` to use a different port.

Run the available JavaScript syntax checks with `npm test`.

## Structure
- `server.js` — server and Socket.io handling
- `public/` — browser assets
- `index.html` — chat interface
- `package.json` — dependencies and scripts