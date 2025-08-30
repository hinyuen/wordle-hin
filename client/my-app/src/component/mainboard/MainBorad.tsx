import CharSelectionRow from '../charSelectionRow/CharSelectionRow';
import KeyBoard from '../keyboard/Keyboard';
import { GameStatus, ResultType } from './type';
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
    } = useBackgroundContext();

    const onSubmit = async () => {
        try {
            const verifiedRes = await validateSelection(attemptList, answer);
            saveSelectedKey(verifiedRes.currentAttempt);
            setAttemptList(verifiedRes.verifiedSelection);
            setGameStatus(verifiedRes.gameStatus);
        } catch (error) {
            console.error('Error validating selection:', error);
        }
    };

    const onRestart = async () => {
        await getAnswer();
        setAttemptList(initialAttemptList);
        setGameStatus(GameStatus.PLAYING);
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
        </>
    );
};

export default MainBoard;
