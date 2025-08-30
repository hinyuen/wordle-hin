import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { BASE_ANSWER, generateRandomWord, handleValidateAbsurdleSelection, handleValidateSelection } from './util.js';
import http from 'http';
import { Server } from 'socket.io';
import { AbsurdleGame, Attempt } from './type.js';

const app = express();
const PORT = 3001;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || /^http:\/\/(?:localhost|192\.168\.\d+\.\d+):5173$/.test(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    },
});

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || /^http:\/\/(?:localhost|192\.168\.\d+\.\d+):5173$/.test(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    })
);
app.use(express.json());

app.get('/answer', (req: Request, res: Response) => {
    try {
        const answer = generateRandomWord();
        res.json({ answer: answer }).status(200);
    } catch (error) {
        console.error('Error fetching answer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/validate', (req: Request, res: Response) => {
    const { answer, attempts } = req.body;
    try {
        const data = handleValidateSelection(attempts, answer);
        res.json({
            verifiedSelection: data.verifiedSelection,
            currentAttempt: data.currentAttempt,
            gameStatus: data.gameStatus,
        }).status(200);
    } catch (error) {
        console.error('Error verifying selection:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const absurdleGames = new Map<string, AbsurdleGame>();

app.post('/validateAbsurdle', (req: Request, res: Response) => {
    try {
        const { attempts, gameId } = req.body;
        if (!absurdleGames.has(gameId)) {
            absurdleGames.set(gameId, { pool: BASE_ANSWER });
        }
        const data = handleValidateAbsurdleSelection(attempts, absurdleGames, gameId);
        res.json({
            verifiedSelection: data.verifiedSelection,
            currentAttempt: data.currentAttempt,
            gameStatus: data.gameStatus,
        }).status(200);
    } catch (error) {
        console.error('Error verifying selection:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const gameData = new Map<string, { answer: string }>();

// Socket.IO connection handler
io.on('connection', (socket) => {
    socket.on('join', ({ gameId }) => {
        if (!gameData.has(gameId)) {
            const answer = generateRandomWord();
            gameData.set(gameId, { answer });
        }
        const room = io.sockets.adapter.rooms.get(gameId);
        const numPlayers = room ? room.size : 0;

        if (numPlayers >= 2) {
            // Room is full, notify the user
            socket.emit('roomFull', { message: 'This game already has 2 players.' });
            return;
        }

        socket.join(gameId);
        // After joining, check again and emit 'ready' if 2 players are present
        const updatedRoom = io.sockets.adapter.rooms.get(gameId);
        const updatedNumPlayers = updatedRoom ? updatedRoom.size : 0;
        if (updatedNumPlayers === 2) {
            io.to(gameId).emit('ready', { message: 'Both players are here! Game can start.' });
        }
    });

    socket.on('gameStart', ({ gameId }: { gameId: string }) => {
        io.to(gameId).emit('gameStarted', { message: 'Game has started!' });
    });

    socket.on('submitAttempt', ({ gameId, attempts }: { gameId: string; attempts: Attempt[] }) => {
        const game = gameData.get(gameId);
        const answer = game?.answer;
        if (!answer) return;
        const data = handleValidateSelection(attempts, answer);
        io.to(gameId).emit('validationResult', { data: data, userId: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
