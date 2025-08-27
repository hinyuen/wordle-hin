import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { Attempt, GameStatus, VerifiedResponse } from '../component/mainboard/type';
import { BASE_API_URL, initialAttemptList } from '../util';

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

    const validateSelection = async (attempts: Attempt[], answer: string): Promise<VerifiedResponse> => {
        const res = await fetch(`${BASE_API_URL}/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ attempts, answer }),
        });
        const data = (await res.json()) as VerifiedResponse;
        return data;
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
        validateSelection,
    };
};

export default useGameSetUp;
