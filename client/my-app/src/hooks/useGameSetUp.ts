import { useEffect, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import { Attempt, GameStatus, LetterData, ResultType, VerifiedResponse } from '../type';
import { BASE_API_URL, findFirstEmptySelection, findFirstUnSubmitted, initialAttemptList } from '../util';

const useGameSetUp = () => {
    const [answer, setAnswer] = useState<string>('');
    const [attemptList, setAttemptList] = useImmer<Attempt[]>(initialAttemptList);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING);
    const [selectedKey, setSelectedKey] = useState(new Map<string, ResultType>());
    const [oppAttemptList, setOppAttemptList] = useImmer<Attempt[]>(initialAttemptList);
    const [oppGameStatus, setOppGameStatus] = useState<GameStatus>(GameStatus.PLAYING);
    const [oppSelectedKey, setOppSelectedKey] = useState(new Map<string, ResultType>());

    useEffect(() => {
        getAnswer();
    }, []);

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

    const deleteKey = () => {
        const unSubmittedIndex = findFirstUnSubmitted(attemptList);
        if (unSubmittedIndex === -1) return;
        const att = attemptList[unSubmittedIndex];
        const cloned = structuredClone(att.selection);
        let indexToRemove = -1;
        for (let index = 0; index < cloned.length; index++) {
            const lastElement = cloned[cloned.length - index - 1];
            indexToRemove = cloned.length - index - 1;
            if (lastElement.letter !== '') {
                break;
            }
        }
        if (indexToRemove === -1) return;
        setAttemptList((draft) => {
            draft[unSubmittedIndex].selection[indexToRemove].letter = '';
        });
    };

    const insertKey = (key: string) => {
        console.log('Inserting key', key);
        const unSubmittedIndex = findFirstUnSubmitted(attemptList);
        console.log('Unsubmitted index is', unSubmittedIndex);
        if (unSubmittedIndex === -1) return;
        const att = attemptList[unSubmittedIndex];
        const firstEmptyIndex = findFirstEmptySelection(att.selection);
        console.log('First empty index is', firstEmptyIndex);
        if (firstEmptyIndex === -1) return;
        setAttemptList((draft) => {
            draft[unSubmittedIndex].selection[firstEmptyIndex].letter = key;
        });
    };

    const saveSelectedKey = (selectedKeyList: LetterData[]) => {
        console.log('Saving selected keys:', selectedKeyList);
        console.log('Current selected key map:', selectedKey);
        const clonedMap = new Map<string, ResultType>(selectedKey);
        selectedKeyList.forEach((v) => {
            if (!clonedMap.has(v.letter)) {
                clonedMap.set(v.letter, v.type);
                return;
            }
            const existingType = clonedMap.get(v.letter);
            if (!existingType) return;
            switch (existingType) {
                case ResultType.PRESENT:
                    if (v.type === ResultType.HIT) {
                        clonedMap.set(v.letter, ResultType.HIT);
                    }
                    break;
                default:
                    break;
            }
        });
        setSelectedKey(clonedMap);
    };

    const saveOppSelectedKey = (selectedKeyList: LetterData[]) => {
        console.log('Saving selected keys:', selectedKeyList);
        console.log('Current selected key map:', oppSelectedKey);
        const clonedMap = new Map<string, ResultType>(oppSelectedKey);
        selectedKeyList.forEach((v) => {
            if (!clonedMap.has(v.letter)) {
                clonedMap.set(v.letter, v.type);
                return;
            }
            const existingType = clonedMap.get(v.letter);
            if (!existingType) return;
            switch (existingType) {
                case ResultType.PRESENT:
                    if (v.type === ResultType.HIT) {
                        clonedMap.set(v.letter, ResultType.HIT);
                    }
                    break;
                default:
                    break;
            }
        });
        setOppSelectedKey(clonedMap);
    };

    const enableSubmit = useMemo(() => {
        if ([GameStatus.WON, GameStatus.LOSE].includes(gameStatus)) return false;
        const unSubmittedIndex = findFirstUnSubmitted(attemptList);
        if (unSubmittedIndex === -1) return false;
        const att = attemptList[unSubmittedIndex];
        return att.selection.every((item) => item.letter.length > 0);
    }, [attemptList, gameStatus]);

    return {
        answer,
        setAnswer,
        attemptList,
        setAttemptList,
        gameStatus,
        setGameStatus,
        getAnswer,
        validateSelection,
        enableSubmit,
        deleteKey,
        insertKey,
        saveSelectedKey,
        selectedKey,
        setSelectedKey,
        setOppAttemptList,
        oppAttemptList,
        oppGameStatus,
        setOppGameStatus,
        oppSelectedKey,
        setOppSelectedKey,
        saveOppSelectedKey,
    };
};

export default useGameSetUp;
