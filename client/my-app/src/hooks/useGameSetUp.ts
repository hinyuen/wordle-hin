import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { Attempt, GameStatus } from '../component/mainboard/type';
import { BASE_API_URL, generateRandomWord, initialAttemptList } from '../util';

const useGameSetUp = () => {
    const [answer, setAnswer] = useState<string>('');
    const [attemptList, setAttemptList] = useImmer<Attempt[]>(initialAttemptList);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING);

    const getAnswer = async () => {
        try {
            const res = await fetch(`${BASE_API_URL}/answer`);
            const data = await res.json();
            setAnswer(data.answer);
        } catch (error) {
            console.error('Error fetching answer:', error);
        }
    };

    useEffect(() => {
        getAnswer();
    }, []);

    return {
        answer,
        setAnswer,
        attemptList,
        setAttemptList,
        gameStatus,
        setGameStatus,
        getAnswer,
    };
};

export default useGameSetUp;
