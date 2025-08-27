import React, { createContext, useContext } from 'react';
import { Attempt, GameStatus, VerifiedResponse } from '../mainboard/type';
import { Updater } from 'use-immer';
type BackgroundContextType = {
    answer: string;
    setAnswer: React.Dispatch<React.SetStateAction<string>>;
    attemptList: Attempt[];
    setAttemptList: Updater<Attempt[]>;
    gameStatus: GameStatus;
    setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
    getAnswer: () => Promise<void>;
    validateSelection: (attempts: Attempt[], answer: string) => Promise<VerifiedResponse>;
};
export const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const useBackgroundContext = () => {
    const context = useContext(BackgroundContext);
    if (!context) {
        throw new Error('useMyContext must be used within a MyContext.Provider');
    }
    return context;
};
