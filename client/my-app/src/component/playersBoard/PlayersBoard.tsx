import { useParams } from 'react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import RuleModal from '../Rule/RuleModal';
import { io, Socket } from 'socket.io-client';
import { BASE_API_URL } from '../../util';
import KeyBoard from '../keyboard/Keyboard';
import { GameStatus, SocketVerifiedResponse } from '../mainboard/type';
import { useBackgroundContext } from '../background/context';
import CharSelectionRow from '../charSelectionRow/CharSelectionRow';
import ResultGrid from '../resultGrid/ResultGrid';

const PlayersBoard = () => {
    const socketRef = useRef<Socket | null>(null);
    const userIdRef = useRef<string | undefined>(undefined);
    const params = useParams();
    const [open, setOpen] = useState(true);
    const [playersReady, setPlayersReady] = useState(false);
    const {
        setGameStatus,
        gameStatus,
        attemptList,
        selectedKey,
        oppAttemptList,
        enableSubmit,
        deleteKey,
        insertKey,
        saveSelectedKey,
        setAttemptList,
        saveOppSelectedKey,
        setOppAttemptList,
        setOppGameStatus,
        oppGameStatus,
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
                userIdRef.current = socketRef.current?.id;
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

            socketRef.current.on('validationResult', (res: SocketVerifiedResponse) => {
                console.log('Validation result:', res);
                if (res.userId) {
                    const data = res.data;
                    if (res.userId === userIdRef.current) {
                        console.log('got userId match');
                        saveSelectedKey(data.currentAttempt);
                        setAttemptList(data.verifiedSelection);
                        setGameStatus(data.gameStatus);
                    } else {
                        saveOppSelectedKey(data.currentAttempt);
                        setOppAttemptList(data.verifiedSelection);
                        setOppGameStatus(data.gameStatus);
                    }
                }
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [params]);

    const keyBoardEnabled = useMemo(() => {
        if (!playersReady || gameStatus !== GameStatus.PLAYING || oppGameStatus !== GameStatus.PLAYING) return false;
        return true;
    }, [gameStatus, playersReady, oppGameStatus]);

    const onSubmit = () => {
        if (!socketRef.current) return;
        socketRef.current.emit('submitAttempt', { gameId: params?.gameId, attempts: attemptList });
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
                        return (
                            <CharSelectionRow
                                key={`attempt-${idx}`}
                                selections={attempt.selection}
                                needHideAnswer={false}
                            />
                        );
                    })}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <h4>Opponent</h4>
                    {oppAttemptList.map((attempt, idx) => {
                        return (
                            <CharSelectionRow
                                key={`attempt-${idx}`}
                                selections={attempt.selection}
                                needHideAnswer={true}
                            />
                        );
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
