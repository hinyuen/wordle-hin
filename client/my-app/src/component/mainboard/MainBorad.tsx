import { useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import CharSelectionRow from '../charSelectionRow/CharSelectionRow';
import KeyBoard from '../keyboard/Keyboard';
import { Attempt, LetterData, ResultType } from './type';

const BASE_ANSWER = ['HELLO', 'WORLD', 'QUITE', 'FANCY', 'FRESH', 'PANIC', 'CRAZY', 'BUGGY', 'SCARE'];
export const LETTER_LIMIT = 5;
const BASE_ATTEMPTS = 5;

const BASE_LETTER_DATA: LetterData = {
    letter: '',
    type: ResultType.EMPTY,
};

const BASE_ATTEMPT_OBJ: Attempt = {
    selection: [BASE_LETTER_DATA, BASE_LETTER_DATA, BASE_LETTER_DATA, BASE_LETTER_DATA, BASE_LETTER_DATA],
    isSubmit: false,
};
const initialAttemptList = Array.from({ length: BASE_ATTEMPTS }, () => ({
    ...BASE_ATTEMPT_OBJ,
}));
const MainBoard = () => {
    const [answer, setAnswer] = useState<string>(BASE_ANSWER[Math.floor(Math.random() * BASE_ANSWER.length)]);
    const [attemptList, setAttemptList] = useImmer<Attempt[]>(initialAttemptList);
    const [selectedKey, setSelectedKey] = useState(new Map<string, ResultType>());

    const findFirstUnSubmitted = (attemptList: Attempt[] = []) => {
        const index = attemptList.findIndex((attempt) => !attempt.isSubmit);
        return index;
    };

    const findFirstEmptySelection = (selection: LetterData[] = []) => {
        const index = selection.findIndex((item) => !item.letter.length);
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

    const enableSubmit = useMemo(() => {
        const unSubmittedIndex = findFirstUnSubmitted(attemptList);
        if (unSubmittedIndex === -1) return false;
        const att = attemptList[unSubmittedIndex];
        return att.selection.every((item) => item.letter.length > 0);
    }, [attemptList]);

    const saveSelectedKey = (selectedKeyList: LetterData[]) => {
        const clonedMap = new Map<string, ResultType>(selectedKey);
        selectedKeyList.forEach((v) => {
            if (!clonedMap.has(v.letter)) {
                clonedMap.set(v.letter, v.type);
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

    const onSubmit = () => {
        const unSubmittedIndex = findFirstUnSubmitted(attemptList);
        if (unSubmittedIndex === -1) return;
        const att = attemptList[unSubmittedIndex];
        const selectedKeyList: LetterData[] = [];
        const verifiedSelection = att.selection.map((v, i) => {
            const answerLetter = answer[i];
            let baseData = {
                letter: v.letter,
                type: ResultType.MISS,
            };
            if (v.letter === answerLetter) {
                baseData.type = ResultType.HIT;
            }
            if (baseData.type === ResultType.MISS && answer.includes(v.letter)) {
                baseData.type = ResultType.PRESENT;
            }
            selectedKeyList.push(baseData);
            return baseData;
        });

        saveSelectedKey(selectedKeyList);

        setAttemptList((draft) => {
            draft[unSubmittedIndex].isSubmit = true;
            draft[unSubmittedIndex].selection = verifiedSelection;
        });
    };

    console.log('answer => ', answer);
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
                onSubmit={onSubmit}
                selectedKey={selectedKey}
            />
            {/* <button onClick={() => console.log('selectedKeys => ', selectedKey)}>log</button> */}
        </>
    );
};

export default MainBoard;
