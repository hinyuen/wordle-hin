export enum ResultType {
    HIT = 'HIT',
    MISS = 'MISS',
    PRESENT = 'PRESENT',
    EMPTY = 'EMPTY',
}

export type LetterData = {
    letter: string;
    type: ResultType;
};

export type Attempt = {
    isSubmit: boolean;
    selection: LetterData[];
};

export enum GameStatus {
    WON = 'WON',
    LOSE = 'LOSE',
    PLAYING = 'PLAYING',
}

export type VerifiedResponse = {
    verifiedSelection: Attempt[];
    currentAttempt: LetterData[];
    gameStatus: GameStatus;
};

export type SocketVerifiedResponse = {
    verifiedSelection: Attempt[];
    currentAttempt: LetterData[];
    gameStatus: GameStatus;
    userId: string;
};
