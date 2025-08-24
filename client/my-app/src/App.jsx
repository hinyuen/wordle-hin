import './App.css';
import CharSelectionRow from './component/charSelectionRow/CharSelectionRow';
import KeyBoard from './component/keyboard/Keyboard';
import { useImmer } from 'use-immer';
import { useState } from 'react';

const BASE_ANSWER = ['HELLO', 'WORLD', 'QUITE', 'FANCY', 'FRESH', 'PANIC', 'CRAZY', 'BUGGY', 'SCARE'];
export const LETTER_LIMIT = 5;
const BASE_ATTEMPTS = 5;

const BASE_ATTEMPT_OBJ = {
    selection: ['', '', '', '', ''],
    isSubmit: false,
};

const initialAttemptList = Array.from({ length: BASE_ATTEMPTS }, () => ({
    ...BASE_ATTEMPT_OBJ,
}));

function App() {
    // const [attempts, setAttempts] = useState(BASE_ATTEMPTS);
    const [answer, setAnswer] = useState(BASE_ANSWER[Math.floor(Math.random() * BASE_ANSWER.length)]);
    const [attemptList, setAttemptList] = useImmer(initialAttemptList);
    // console.log(setAnswer);

    console.log('attemptList', attemptList);

    const findFirstUnSubmitted = (attemptList = []) => {
        const index = attemptList.findIndex((attempt) => !attempt.isSubmit);
        return index;
    };

    const findFirstEmptySelection = (selection = []) => {
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
        setAttemptList((draft) => {
            const att = draft[unSubmittedIndex];
            console.log('Current att is', att);
            const firstEmptyIndex = findFirstEmptySelection(att.selection);
            if (firstEmptyIndex === -1) return;
            draft[unSubmittedIndex].selection[firstEmptyIndex] = key;
        });
    };

    // console.log('Answer is', answer);

    return (
        <Background>
            <h1>Hin's Wordle</h1>
            <div style={{ marginBottom: '1rem' }}>
                {attemptList.map((attempt, idx) => {
                    return <CharSelectionRow key={`attempt-${idx}`} selections={attempt.selection} />;
                })}
            </div>
            <KeyBoard
                deleteKey={deleteKey}
                onClick={(key) => {
                    insertKey(key);
                }}
            />
        </Background>
    );
}

export const Background = ({ children }) => {
    return <div style={{ width: '100%', height: '100vh' }}>{children}</div>;
};

export default App;
