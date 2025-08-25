import React, { createContext, useContext } from 'react';

type BackgroundContextType = {
    answer: string;
    setAnswer: React.Dispatch<React.SetStateAction<string>>;
    answerOptions: string[];
    setAnswerOptions: React.Dispatch<React.SetStateAction<string[]>>;
};
export const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const useBackgroundContext = () => {
    const context = useContext(BackgroundContext);
    if (!context) {
        throw new Error('useMyContext must be used within a MyContext.Provider');
    }
    return context;
};
