import { useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import CharSelectionRow from '../charSelectionRow/CharSelectionRow';
import KeyBoard from '../keyboard/Keyboard';

const BASE_ANSWER = ['HELLO', 'WORLD', 'QUITE', 'FANCY', 'FRESH', 'PANIC', 'CRAZY', 'BUGGY', 'SCARE'];
export const LETTER_LIMIT = 5;
const BASE_ATTEMPTS = 5;

const ResultType = {
    HIT: 'HIT',
    MISS: 'MISS',
    PRESENT: 'PRESENT',
};

const BASE_LETTER_DATA = {
    letter: '',
    type: '',
};

const BASE_ATTEMPT_OBJ = {
    selection: ['', '', '', '', ''],
    isSubmit: false,
};
const initialAttemptList = Array.from({ length: BASE_ATTEMPTS }, () => ({
    ...BASE_ATTEMPT_OBJ,
}));
const MainBoard = () => {
    const [answer, setAnswer] = useState<string>(BASE_ANSWER[Math.floor(Math.random() * BASE_ANSWER.length)]);
    const [attemptList, setAttemptList] = useImmer<typeof initialAttemptList>(initialAttemptList);
    const findFirstUnSubmitted = (attemptList: typeof initialAttemptList = []) => {
        const index = attemptList.findIndex((attempt) => !attempt.isSubmit);
        return index;
    };

    const findFirstEmptySelection = (selection: string[] = []) => {
        const index = selection.findIndex((item) => !item);
        return index;
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
            if (lastElement !== '') {
                break;
            }
        }
        if (indexToRemove === -1) return;
        setAttemptList((draft) => {
            draft[unSubmittedIndex].selection[indexToRemove] = '';
        });
    };

    const insertKey = (key) => {
        console.log('Inserting key', key);
        const unSubmittedIndex = findFirstUnSubmitted(attemptList);
        console.log('Unsubmitted index is', unSubmittedIndex);
        if (unSubmittedIndex === -1) return;
        const att = attemptList[unSubmittedIndex];
        const firstEmptyIndex = findFirstEmptySelection(att.selection);
        if (firstEmptyIndex === -1) return;
        setAttemptList((draft) => {
            draft[unSubmittedIndex].selection[firstEmptyIndex] = key;
        });
    };

    const enableSubmit = useMemo(() => {
        const unSubmittedIndex = findFirstUnSubmitted(attemptList);
        if (unSubmittedIndex === -1) return false;
        const att = attemptList[unSubmittedIndex];
        return att.selection.every((item) => item);
    }, [attemptList]);
    return (
        <>
            <h1>Hin's Wordle</h1>
            <div style={{ marginBottom: '1rem' }}>
                {attemptList.map((attempt, idx) => {
                    return <CharSelectionRow key={`attempt-${idx}`} selections={attempt.selection} />;
                })}
            </div>
            <KeyBoard
                deleteKey={deleteKey}
                insertKey={(key) => {
                    insertKey(key);
                }}
                enableSubmit={enableSubmit}
                answer={answer}
                onSubmit={() => console.log('submit')}
            />
        </>
    );
};

export default MainBoard;
