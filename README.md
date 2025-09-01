# wordle-hin

This project uses React.js and Node.js with Express.js (both in TypeScript).

For demo purposes, the word list is:

- HELLO
- WORLD
- QUITE
- FANCY
- FRESH
- PANIC
- CRAZY
- BUGGY
- SCARE
- MARRY

- **Frontend:** Located in `client/my-app/src`
- **Backend:** Located in `server/src`

> **Recommended Node.js version:** v22.17.1

---

## Installation

```sh
**Frontend:**
cd client/my-app
npm install

**Backend:**
cd server
npm install
```

## Starting the Program
```sh
**Frontend:**
cd client/my-app
npm run dev

**Backend:**
cd server
npm run dev
```

## Notes
- This project focuses on game and player logic, and is mainly intended for local development to demonstrate my understanding of the task and my problem-solving approach.
- For testing multiplayer mode, copy the URL and open it in another tab or browser. Since this is a local dev version, the server only runs on the machine where the program is started.

## Task Completion
I have completed all 4 tasks:

1. Normal Wordle (client-side)
2. Server/client Wordle
3. Host-cheating Wordle (Absurdle)
4. Multiplayer Wordle

## Features
- Classic Wordle gameplay
- Absurdle (host-cheating) mode
- Multiplayer support (local network)
- Built with React, Node.js, Express, and TypeScript
- Bi-diractional connection using WebSocket (Socket.io)

## Usage
- Open the frontend in your browser after starting both servers.
- For multiplayer, open the app in two tabs or browsers using the same URL and join the same game.

## API Endpoints
- `GET /answer` - Get a random answer word
- `POST /validate` - Validate a guess
- `POST /validateAbsurdle` - Validate a guess in Absurdle mode