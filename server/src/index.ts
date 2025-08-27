import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { BASE_ANSWER, generateRandomWord } from './util.js';

const app = express();
const PORT = 3001;

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
    res.json({ answer: generateRandomWord() }).status(200);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
