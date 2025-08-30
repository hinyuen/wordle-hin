import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import SingleBoard from './page/main/SingleBoard.jsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import MultiRulePage from './page/multiRule/MultiRule.js';
import PlayersBoard from './page/playersBoard/PlayersBoard.js';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SingleBoard />} />
                <Route path="/multiplayer" element={<MultiRulePage />} />
                <Route path="/game/:gameId" element={<PlayersBoard />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
