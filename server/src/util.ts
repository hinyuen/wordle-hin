import { Attempt, GameStatus, LetterData, ResultType, VerifiedResponse } from './type.js';

export const BASE_ANSWER = ['HELLO', 'WORLD', 'QUITE', 'FANCY', 'FRESH', 'PANIC', 'CRAZY', 'BUGGY', 'SCARE', 'MARRY'];
export const generateRandomWord = () => {
    return BASE_ANSWER[Math.floor(Math.random() * BASE_ANSWER.length)];
};

const checkGameStatus = (verifiedSelection: LetterData[], attLastIndex: number, currentIndex: number): GameStatus => {
    if (verifiedSelection.every((v) => v.type === ResultType.HIT)) {
        return GameStatus.WON;
    }
    if (currentIndex === attLastIndex) {
        return GameStatus.LOSE;
    }
    return GameStatus.PLAYING;
};

export const handleValidateSelection = (attemptList: Attempt[], answer: string): VerifiedResponse => {
    let unSubmittedIndex = -1;
    let gameStatus = GameStatus.PLAYING;
    let verifiedSelection: LetterData[] = [];
    try {
        unSubmittedIndex = findFirstUnSubmitted(attemptList);
        if (unSubmittedIndex === -1) throw new Error('No unsubmitted attempt found');
        const att = attemptList[unSubmittedIndex];
        verifiedSelection = getVerifiedSelection(att.selection, answer);
        const cloned = structuredClone(attemptList);
        cloned[unSubmittedIndex].selection = verifiedSelection;
        cloned[unSubmittedIndex].isSubmit = true;
        gameStatus = checkGameStatus(verifiedSelection, attemptList.length - 1, unSubmittedIndex);
        return {
            verifiedSelection: cloned,
            currentAttempt: verifiedSelection,
            gameStatus,
        };
    } catch (error) {
        console.error('Error in handleValidateSelection:', error);
        return {
            verifiedSelection: attemptList,
            currentAttempt: attemptList[0].selection,
            gameStatus,
        };
    }
};

export const findFirstUnSubmitted = (attemptList: Attempt[] = []) => {
    const index = attemptList.findIndex((attempt) => !attempt.isSubmit);
    return index;
};

export const getVerifiedSelection = (selection: LetterData[], answer: string): LetterData[] => {
    try {
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
    } catch (error) {
        console.error('Error in getVerifiedSelection:', error);
        return selection;
    }
};
