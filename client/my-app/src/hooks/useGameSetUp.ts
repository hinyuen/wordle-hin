import { useEffect, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import { Attempt, GameStatus, LetterData, ResultType, SnackBarStateType, VerifiedResponse } from '../type';
import {
    BASE_API_URL,
    findFirstEmptySelection,
    findFirstUnSubmitted,
    initialAttemptList,
    initSnackbarState,
} from '../util';

const useGameSetUp = () => {
    const [answer, setAnswer] = useState<string>('');
    const [attemptList, setAttemptList] = useImmer<Attempt[]>(initialAttemptList);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING);
    const [selectedKey, setSelectedKey] = useState(new Map<string, ResultType>());
    const [oppAttemptList, setOppAttemptList] = useImmer<Attempt[]>(initialAttemptList);
    const [oppGameStatus, setOppGameStatus] = useState<GameStatus>(GameStatus.PLAYING);
    const [oppSelectedKey, setOppSelectedKey] = useState(new Map<string, ResultType>());
    const [snackbarState, setSnackbarState] = useImmer<SnackBarStateType>(initSnackbarState);

    useEffect(() => {
        getAnswer();
    }, []);

    // get answer from API for solo mode
    const getAnswer = async () => {
        try {
            const res = await fetch(`${BASE_API_URL}/answer`);
            const data = await res.json();
            setAnswer(data.answer);
        } catch (error) {
            console.error('Error fetching answer:', error);
        }
    };

    // validate user selection via API
    const validateSelection = async (attempts: Attempt[], answer: string): Promise<VerifiedResponse> => {
        try {
            const res = await fetch(`${BASE_API_URL}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ attempts, answer }),
            });
            if (res.status !== 200) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Unknown error');
            }
            const data = (await res.json()) as VerifiedResponse;
            return data;
        } catch (error) {
            console.error('Error validating selection:', error);
            throw error;
        }
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
        const unSubmittedIndex = findFirstUnSubmitted(attemptList);
        if (unSubmittedIndex === -1) return;
        const att = attemptList[unSubmittedIndex];
        const firstEmptyIndex = findFirstEmptySelection(att.selection);
        if (firstEmptyIndex === -1) return;
        setAttemptList((draft) => {
            draft[unSubmittedIndex].selection[firstEmptyIndex].letter = key;
        });
    };

    // function for handling the selected key UI on keyboard
    const saveSelectedKey = (selectedKeyList: LetterData[]) => {
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
        snackbarState,
        setSnackbarState,
    };
};

export default useGameSetUp;
