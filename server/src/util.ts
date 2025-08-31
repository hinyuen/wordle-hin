import { AbsurdleGame, Attempt, GameStatus, LetterData, ResultType, VerifiedResponse } from './type.js';
// Utility functions for Wordle/Absurdle backend logic

// List of possible answer words
export const BASE_ANSWER = ['HELLO', 'WORLD', 'QUITE', 'FANCY', 'FRESH', 'PANIC', 'CRAZY', 'BUGGY', 'SCARE', 'MARRY'];

/**
 * Generates a random word from the base answer list.
 * @returns {string} A random word.
 */
export const generateRandomWord = () => {
    return BASE_ANSWER[Math.floor(Math.random() * BASE_ANSWER.length)];
};

/**
 * Checks the game status based on the latest guess.
 * @param verifiedSelection - The result of the guess.
 * @param attLastIndex - The last attempt index.
 * @param currentIndex - The current attempt index.
 * @returns {GameStatus} The current game status.
 */
const checkGameStatus = (verifiedSelection: LetterData[], attLastIndex: number, currentIndex: number): GameStatus => {
    // Maximum possible points for a guess (used in Absurdle logic)
    if (verifiedSelection.every((v) => v.type === ResultType.HIT)) {
        return GameStatus.WON;
    }
    if (currentIndex === attLastIndex) {
        return GameStatus.LOSE;
    }
    return GameStatus.PLAYING;
};

/**
 * Validates a user's guess against the answer for classic Wordle mode.
 * @param attemptList - List of attempts so far.
 * @param answer - The correct answer word.
 * @returns {VerifiedResponse} Feedback and updated state.
 */
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

/**
 * Finds the index of the first unsubmitted attempt.
 * @param attemptList - List of attempts.
 * @returns {number} Index of the first unsubmitted attempt, or -1 if all are submitted.
 */
export const findFirstUnSubmitted = (attemptList: Attempt[] = []) => {
    const index = attemptList.findIndex((attempt) => !attempt.isSubmit);
    return index;
};

/**
 * Compares a guess to the answer and returns feedback for each letter.
 * @param selection - The user's guess as an array of LetterData.
 * @param answer - The answer word.
 * @returns {LetterData[]} Feedback for each letter (HIT, PRESENT, MISS).
 */
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

/**
 * Filters the answer pool for Absurdle mode by grouping possible answers by feedback pattern.
 * Keeps the largest group (most ambiguous feedback) to maximize difficulty.
 * @param pool - Current possible answers.
 * @param selection - The user's guess as LetterData[]
 * @returns {string[]} The filtered pool of possible answers.
 */
const getFilteredPool = (pool: string[], selection: LetterData[]): string[] => {
    const patternMap: Record<string, string[]> = {};

    for (const answerOption of pool) {
        // Get feedback for this answerOption
        const feedback = getVerifiedSelection(selection, answerOption);
        // Convert feedback to a string pattern, e.g. "HIT-MISS-PRESENT-MISS-MISS"
        const pattern = feedback.map((l) => l.type).join('-');
        // Group answerOptions by pattern
        if (!patternMap[pattern]) patternMap[pattern] = [];
        patternMap[pattern].push(answerOption);
    }

    // Find the largest group (most ambiguous feedback)
    let max = 0;
    let largestGroup: string[] = [];
    for (const group of Object.values(patternMap)) {
        if (group.length > max) {
            max = group.length;
            largestGroup = group;
        }
    }
    return largestGroup;
};

/**
 * Validates a user's guess for Absurdle mode, updating the answer pool and generating feedback.
 * @param attemps - List of attempts so far.
 * @param absurdleGames - Map of gameId to AbsurdleGame state.
 * @param gameId - The current game/session ID.
 * @returns {VerifiedResponse} Feedback and updated state.
 */
export const handleValidateAbsurdleSelection = (
    attemps: Attempt[],
    absurdleGames: Map<string, AbsurdleGame>,
    gameId: string
): VerifiedResponse => {
    if (!gameId) throw new Error('No game found');
    const game = absurdleGames.get(gameId);
    if (!game) throw new Error('No game found');
    let verifiedSelection: LetterData[] = [];
    let gameStatus: GameStatus = GameStatus.PLAYING;
    const clonedAttempts = structuredClone(attemps);
    const unSubmittedIndex = findFirstUnSubmitted(clonedAttempts);
    if (unSubmittedIndex === -1) throw new Error('No unsubmitted attempt found');
    const att = clonedAttempts[unSubmittedIndex];
    const updatedPool = getFilteredPool(game.pool, att.selection);
    let hint: string = '';
    if (updatedPool.length) {
        hint = updatedPool[0];
    }
    game.pool = updatedPool;
    absurdleGames.set(gameId, game);
    verifiedSelection = getVerifiedSelection(att.selection, hint);
    clonedAttempts[unSubmittedIndex].selection = verifiedSelection;
    clonedAttempts[unSubmittedIndex].isSubmit = true;
    gameStatus = checkGameStatus(verifiedSelection, clonedAttempts.length - 1, unSubmittedIndex);
    if (gameStatus !== GameStatus.PLAYING) {
        absurdleGames.delete(gameId);
    }
    return {
        verifiedSelection: clonedAttempts,
        currentAttempt: verifiedSelection,
        gameStatus: gameStatus,
    };
};

/**
 * Checks if the user's guess (attempt) is a valid word in the answer list.
 * @param attempt - The user's current attempt (letters selected).
 * @returns {boolean} True if the guess is in BASE_ANSWER, false otherwise.
 */
export const isAttemptInsideWordList = (attempt: Attempt) => {
    const userGuess = attempt.selection.map((v) => v.letter).join('');
    return BASE_ANSWER.includes(userGuess);
};
