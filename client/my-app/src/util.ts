import { Attempt, LetterData, ResultType } from '../src/component/mainboard/type';

import words from './words.json';
export const BASE_ANSWER = ['HELLO', 'WORLD', 'QUITE', 'FANCY', 'FRESH', 'PANIC', 'CRAZY', 'BUGGY', 'SCARE', 'MARRY'];
export const LETTER_LIMIT = 5;
export const BASE_ATTEMPTS = 5;

const BASE_LETTER_DATA: LetterData = {
    letter: '',
    type: ResultType.EMPTY,
};

export const BASE_ATTEMPT_OBJ: Attempt = {
    selection: [BASE_LETTER_DATA, BASE_LETTER_DATA, BASE_LETTER_DATA, BASE_LETTER_DATA, BASE_LETTER_DATA],
    isSubmit: false,
};

export const initialAttemptList = Array.from({ length: BASE_ATTEMPTS }, () => ({
    ...BASE_ATTEMPT_OBJ,
}));

export const generateRandomWord = () => {
    return BASE_ANSWER[Math.floor(Math.random() * BASE_ANSWER.length)];
    // return 'MARRY';
};

export function generateGameId(length = 21) {
    // Create a random array of bytes
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    // Convert to base64 and make it URL-safe
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
        .slice(0, length);
}

export const wordsList = words.words;

export const BASE_API_URL = 'http://localhost:3001';

export const findFirstUnSubmitted = (attemptList: Attempt[] = []) => {
    const index = attemptList.findIndex((attempt) => !attempt.isSubmit);
    return index;
};

export const findFirstEmptySelection = (selection: LetterData[] = []) => {
    const index = selection.findIndex((item) => !item.letter.length);
    return index;
};
