import CharSelectionRow from '../charSelectionRow/CharSelectionRow';
import KeyBoard from '../keyboard/Keyboard';
import { GameStatus, ResultType } from '../../type';
import ResultGrid from '../resultGrid/ResultGrid';
import { initialAttemptList } from '../../util';
import { useBackgroundContext } from '../background/context';

const MainBoard = () => {
    const {
        answer,
        attemptList,
        setAttemptList,
        setGameStatus,
        gameStatus,
        getAnswer,
        validateSelection,
        enableSubmit,
        deleteKey,
        insertKey,
        saveSelectedKey,
        selectedKey,
        setSelectedKey,
        setSnackbarState,
    } = useBackgroundContext();

    const onSubmit = async () => {
        try {
            const verifiedRes = await validateSelection(attemptList, answer);
            saveSelectedKey(verifiedRes.currentAttempt);
            setAttemptList(verifiedRes.verifiedSelection);
            setGameStatus(verifiedRes.gameStatus);
        } catch (error) {
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

    const onRestart = async () => {
        await getAnswer();
        setAttemptList(initialAttemptList);
        setGameStatus(GameStatus.PLAYING);
        setSelectedKey(new Map<string, ResultType>());
    };

    return (
        <>
            <h1>Hin's Wordle</h1>
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
                insertKey={(key) => {
                    insertKey(key);
                }}
                enableSubmit={enableSubmit}
                onSubmit={onSubmit}
                selectedKey={selectedKey}
            />
            <ResultGrid gameStatus={gameStatus} onRestart={onRestart} />
        </>
    );
};

export default MainBoard;
