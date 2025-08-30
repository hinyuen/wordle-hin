import { useEffect, useRef } from 'react';
import { Attempt, GameStatus, ResultType, VerifiedResponse } from '../../type';
import { BASE_API_URL, generateGameId, initialAttemptList } from '../../util';
import { useBackgroundContext } from '../background/context';
import CharSelectionRow from '../charSelectionRow/CharSelectionRow';
import KeyBoard from '../keyboard/Keyboard';
import ResultGrid from '../resultGrid/ResultGrid';

const AbsurdleGameBoard = () => {
    const {
        attemptList,
        setAttemptList,
        setGameStatus,
        gameStatus,
        deleteKey,
        insertKey,
        enableSubmit,
        selectedKey,
        setSelectedKey,
        saveSelectedKey,
        setSnackbarState,
    } = useBackgroundContext();

    const gameIdRef = useRef<string | null>(null);

    useEffect(() => {
        gameIdRef.current = generateGameId();
        return () => {
            gameIdRef.current = null;
        };
    }, []);

    const validateAbsurdleSelection = async (attemps: Attempt[]): Promise<VerifiedResponse> => {
        const gameId = gameIdRef.current;
        const res = await fetch(`${BASE_API_URL}/validateAbsurdle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                attempts: attemptList,
                gameId,
            }),
        });
        if (res.status !== 200) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Unknown error');
        }

        const data = (await res.json()) as VerifiedResponse;
        return data;
    };

    const onSubmit = async () => {
        try {
            const res = await validateAbsurdleSelection(attemptList);
            console.log('res => ', res);
            saveSelectedKey(res.currentAttempt);
            setAttemptList(res.verifiedSelection);
            setGameStatus(res.gameStatus);
        } catch (error) {
            console.error('Error validating selection:', error);
            let errMsg = 'Error validating selection';
            if (error?.message && error?.message === 'INVALID_ATTEMPT') {
                errMsg = 'Attempt not in word list';
            }
            setSnackbarState((draft) => {
                draft.open = true;
                draft.message = errMsg;
            });
        }
    };

    const onRestart = () => {
        setAttemptList(initialAttemptList);
        setGameStatus(GameStatus.PLAYING);
        setSelectedKey(new Map<string, ResultType>());
        gameIdRef.current = generateGameId();
    };

    return (
        <>
            <h1>Absurdle</h1>
            <div style={{ marginBottom: '1rem' }}>
                {attemptList.map((attempt, idx) => {
                    return (
                        <CharSelectionRow
                            key={`attempt-${idx}`}
                            selections={attempt.selection}
                            needHideAnswer={false}
                        />
                    );
                })}
            </div>
            <KeyBoard
                keysEnabled={gameStatus === GameStatus.PLAYING}
                deleteKey={deleteKey}
                insertKey={(key) => insertKey(key)}
                enableSubmit={enableSubmit}
                onSubmit={onSubmit}
                selectedKey={selectedKey}
            />
            <ResultGrid gameStatus={gameStatus} onRestart={onRestart} />
        </>
    );
};

export default AbsurdleGameBoard;
