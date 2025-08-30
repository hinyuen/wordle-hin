import React, { createContext, useContext } from 'react';
import { Attempt, GameStatus, LetterData, ResultType, VerifiedResponse } from '../../type';
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
    enableSubmit: boolean;
    deleteKey: () => void;
    insertKey: (key: string) => void;
    saveSelectedKey: (selectedKeyList: LetterData[]) => void;
    selectedKey: Map<string, ResultType>;
    setSelectedKey: React.Dispatch<React.SetStateAction<Map<string, ResultType>>>;
    oppAttemptList: Attempt[];
    setOppAttemptList: Updater<Attempt[]>;
    oppGameStatus: GameStatus;
    setOppGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
    oppSelectedKey: Map<string, ResultType>;
    setOppSelectedKey: React.Dispatch<React.SetStateAction<Map<string, ResultType>>>;
    saveOppSelectedKey: (selectedKeyList: LetterData[]) => void;
};
export const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const useBackgroundContext = () => {
    const context = useContext(BackgroundContext);
    if (!context) {
        throw new Error('useMyContext must be used within a MyContext.Provider');
    }
    return context;
};
