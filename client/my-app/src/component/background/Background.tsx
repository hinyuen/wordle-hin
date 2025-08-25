import React, { useState } from 'react';
import Setting from '../setting/Setting';
import { BackgroundContext } from './context';
import { BASE_ANSWER, generateRandomWord } from '../../util';
import { useImmer } from 'use-immer';

export const Background: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [answer, setAnswer] = useState<string>(generateRandomWord());
    const [answerOptions, setAnswerOptions] = useImmer(BASE_ANSWER);

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <BackgroundContext.Provider
                value={{
                    setAnswer,
                    answer,
                    answerOptions,
                    setAnswerOptions,
                }}
            >
                <Setting />
                {children}
            </BackgroundContext.Provider>
        </div>
    );
};

export default Background;
