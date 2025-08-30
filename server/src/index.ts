import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { generateRandomWord, handleValidateSelection } from './util.js';
import http from 'http';
import { Server } from 'socket.io';

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

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express + TypeScript!');
});

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
    console.log('req.body => ', req.body);
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

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', ({ gameId }) => {
        socket.join(gameId);
        console.log(`User ${socket.id} joined game ${gameId}`);
        // You can emit events to the room here
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
