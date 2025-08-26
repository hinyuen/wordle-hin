import React, { createContext, useContext } from 'react';
import { Attempt, GameStatus } from '../mainboard/type';

type BackgroundContextType = {
    answer: string;
    setAnswer: React.Dispatch<React.SetStateAction<string>>;
    attemptList: Attempt[];
    setAttemptList: (updater: any) => void;
    gameStatus: GameStatus;
    setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
};
export const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const useBackgroundContext = () => {
    const context = useContext(BackgroundContext);
    if (!context) {
        throw new Error('useMyContext must be used within a MyContext.Provider');
    }
    return context;
};
