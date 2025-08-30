import { useParams } from 'react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import RuleModal from '../Rule/RuleModal';
import { io, Socket } from 'socket.io-client';
import { BASE_API_URL } from '../../util';
import KeyBoard from '../keyboard/Keyboard';
import { GameStatus } from '../mainboard/type';
import { useBackgroundContext } from '../background/context';
import CharSelectionRow from '../charSelectionRow/CharSelectionRow';
import ResultGrid from '../resultGrid/ResultGrid';

const PlayersBoard = () => {
    const socketRef = useRef<Socket | null>(null);
    const params = useParams();
    const [open, setOpen] = useState(true);
    const [playersReady, setPlayersReady] = useState(false);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const {
        setGameStatus,
        gameStatus,
        attemptList,
        selectedKey,
        setSelectedKey,
        oppAttemptList,
        enableSubmit,
        deleteKey,
        insertKey,
    } = useBackgroundContext();

    const handleStartGame = () => {
        if (!socketRef.current) return;
        socketRef.current.emit('gameStart', { gameId: params?.gameId });
    };

    useEffect(() => {
        if (!params) return;
        const { gameId } = params;
        socketRef.current = io(BASE_API_URL);
        if (socketRef.current) {
            socketRef.current.on('connect', () => {
                console.log('Connected:', socketRef.current?.id);
                setUserId(socketRef.current?.id);
                socketRef.current?.emit('join', { gameId });
            });

            socketRef.current.on('ready', () => {
                // Handle ready event
                console.log('Both players are ready!');
                setPlayersReady(true);
            });

            socketRef.current.on('gameStarted', () => {
                console.log('Game has started');
                setOpen(false);
            });

            socketRef.current.on('opponentLeft', () => {
                console.log('Your opponent has left the game.');
                alert('Your opponent has left the game.');
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [params]);

    console.log('userId => ', userId);

    const keyBoardEnabled = useMemo(() => {
        if (!playersReady || gameStatus !== GameStatus.PLAYING) return false;
        return true;
    }, [gameStatus, playersReady]);

    const onSubmit = () => {
        console.log('Submit');
    };

    const onRestart = () => {
        // window.location.reload();
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <h4>You</h4>
                    {attemptList.map((attempt, idx) => {
                        return <CharSelectionRow key={`attempt-${idx}`} selections={attempt.selection} />;
                    })}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <h4>Opponent</h4>
                    {oppAttemptList.map((attempt, idx) => {
                        return <CharSelectionRow key={`attempt-${idx}`} selections={attempt.selection} />;
                    })}
                </div>
            </div>
            <KeyBoard
                keysEnabled={keyBoardEnabled}
                deleteKey={deleteKey}
                insertKey={(key) => {
                    insertKey(key);
                }}
                enableSubmit={enableSubmit}
                onSubmit={onSubmit}
                selectedKey={selectedKey}
            />
            <ResultGrid gameStatus={gameStatus} onRestart={onRestart} />
            <RuleModal open={open} playersReady={playersReady} startGame={handleStartGame} />
        </>
    );
};

export default PlayersBoard;
