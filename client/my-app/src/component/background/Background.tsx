import React, { useState } from 'react';
import Setting from '../setting/Setting';
import { BackgroundContext } from './context';
import { generateRandomWord, initialAttemptList } from '../../util';
import { useImmer } from 'use-immer';
import { Attempt, GameStatus } from '../mainboard/type';

export const Background: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [answer, setAnswer] = useState<string>(generateRandomWord());
    const [attemptList, setAttemptList] = useImmer<Attempt[]>(initialAttemptList);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING);

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
                }}
            >
                <Setting />
                {children}
            </BackgroundContext.Provider>
        </div>
    );
};

export default Background;
