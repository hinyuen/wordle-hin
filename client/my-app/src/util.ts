import { Attempt, LetterData, ResultType } from '../src/component/mainboard/type';
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
