import { useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import CharSelectionRow from '../charSelectionRow/CharSelectionRow';
import KeyBoard from '../keyboard/Keyboard';
import { Attempt, GameStatus, LetterData, ResultType } from './type';
import ResultGrid from '../resultGrid/ResultGrid';
import { initialAttemptList, generateRandomWord } from '../../util';
import { useBackgroundContext } from '../background/context';

const MainBoard = () => {
    const { answer, setAnswer } = useBackgroundContext();
    const [attemptList, setAttemptList] = useImmer<Attempt[]>(initialAttemptList);
    const [selectedKey, setSelectedKey] = useState(new Map<string, ResultType>());
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING);

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
        if ([GameStatus.WON, GameStatus.LOSE].includes(gameStatus)) return false;
        const unSubmittedIndex = findFirstUnSubmitted(attemptList);
        if (unSubmittedIndex === -1) return false;
        const att = attemptList[unSubmittedIndex];
        return att.selection.every((item) => item.letter.length > 0);
    }, [attemptList, gameStatus]);

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

    const checkGameStatus = (verifiedSelection: LetterData[], attLastIndex: number, currentIndex: number) => {
        if (verifiedSelection.every((v) => v.type === ResultType.HIT)) {
            setGameStatus(GameStatus.WON);
            return;
        }
        if (currentIndex === attLastIndex) {
            setGameStatus(GameStatus.LOSE);
            return;
        }
    };

    const getVerifiedSelection = (selection: LetterData[]): LetterData[] => {
        const unmatchedCount: Record<string, number> = {};
        const hitSelection = selection.map((v, i) => {
            const answerLetter = answer[i];
            if (v.letter === answerLetter) {
                return {
                    ...v,
                    type: ResultType.HIT,
                };
            }
            unmatchedCount[answerLetter] = (unmatchedCount[answerLetter] || 0) + 1;
            return { ...v, type: ResultType.MISS };
        });

        return hitSelection.map((v) => {
            if (v.type === ResultType.MISS && unmatchedCount[v.letter]) {
                unmatchedCount[v.letter] -= 1;
                return { ...v, type: ResultType.PRESENT };
            }
            return v;
        });
    };

    const onSubmit = () => {
        const unSubmittedIndex = findFirstUnSubmitted(attemptList);
        if (unSubmittedIndex === -1) return;
        const att = attemptList[unSubmittedIndex];
        const verifiedSelection = getVerifiedSelection(att.selection);
        saveSelectedKey(verifiedSelection);
        setAttemptList((draft) => {
            draft[unSubmittedIndex].isSubmit = true;
            draft[unSubmittedIndex].selection = verifiedSelection;
        });
        const lastIndex = attemptList.length - 1;
        const currentIndex = unSubmittedIndex;
        checkGameStatus(verifiedSelection, lastIndex, currentIndex);
    };

    const onRestart = () => {
        setAttemptList(initialAttemptList);
        setGameStatus(GameStatus.PLAYING);
        setAnswer(generateRandomWord());
        setSelectedKey(new Map<string, ResultType>());
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
                keysEnabled={gameStatus === GameStatus.PLAYING}
                deleteKey={deleteKey}
                insertKey={(key) => {
                    insertKey(key);
                }}
                enableSubmit={enableSubmit}
                onSubmit={onSubmit}
                selectedKey={selectedKey}
            />
            <ResultGrid gameStatus={gameStatus} onRestart={onRestart} />
            {/* <button onClick={() => console.log('selectedKeys => ', selectedKey)}>log</button> */}
        </>
    );
};

export default MainBoard;
