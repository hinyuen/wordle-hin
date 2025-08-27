import React from 'react';
import Setting from '../setting/Setting';
import { BackgroundContext } from './context';
import useGameSetUp from '../../hooks/useGameSetUp';

export const Background: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const { answer, setAnswer, attemptList, setAttemptList, gameStatus, setGameStatus, getAnswer, validateSelection } =
        useGameSetUp();

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <BackgroundContext.Provider
                value={{
                    setAnswer,
                    answer,
                    attemptList,
                    setAttemptList,
                    gameStatus,
                    setGameStatus,
                    getAnswer,
                    validateSelection,
                }}
            >
                <Setting />
                {children}
            </BackgroundContext.Provider>
        </div>
    );
};

export default Background;
