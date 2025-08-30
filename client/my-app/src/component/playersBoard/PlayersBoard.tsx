import { useNavigate, useParams } from 'react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import RuleModal from '../Rule/RuleModal';
import { io, Socket } from 'socket.io-client';
import { BASE_API_URL, generateGameId, initMulitPlayerResult } from '../../util';
import KeyBoard from '../keyboard/Keyboard';
import { GameStatus, MultiPlayerResult, SocketVerifiedResponse } from '../../type';
import { useBackgroundContext } from '../background/context';
import CharSelectionRow from '../charSelectionRow/CharSelectionRow';
import ResultModal from '../resultModal/ResultModal';
import { useImmer } from 'use-immer';

const PlayersBoard = () => {
    const socketRef = useRef<Socket | null>(null);
    const userIdRef = useRef<string | undefined>(undefined);
    const params = useParams();
    const navigate = useNavigate();
    const [ruleModalOpen, setRuleModalOpen] = useState<boolean>(true);
    const [playersReady, setPlayersReady] = useState<boolean>(false);
    const [result, setResult] = useImmer<MultiPlayerResult>(initMulitPlayerResult);
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

    useEffect(() => {
        if (!params) return;
        const { gameId } = params;
        socketRef.current = io(BASE_API_URL);
        if (socketRef.current) {
            socketRef.current.on('connect', () => {
                userIdRef.current = socketRef.current?.id;
                socketRef.current?.emit('join', { gameId });
            });

            socketRef.current.on('ready', () => {
                // Handle ready event
                setPlayersReady(true);
            });

            socketRef.current.on('gameStarted', () => {
                setRuleModalOpen(false);
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

            socketRef.current.on('roomFull', () => {
                alert('Room is full. Please wait for the next game.');
                navigate('/');
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [params]);

    useEffect(() => {
        if (gameStatus === GameStatus.WON || gameStatus === GameStatus.LOSE) {
            const resultTxt = gameStatus === GameStatus.WON ? 'You won!' : 'You lost!';
            setResult((draft) => {
                draft.resultTxt = resultTxt;
                draft.resultModalOpen = true;
            });
        }

        if (oppGameStatus === GameStatus.WON || oppGameStatus === GameStatus.LOSE) {
            const resultTxt = oppGameStatus === GameStatus.WON ? 'You lost!' : 'You won!';
            setResult((draft) => {
                draft.resultTxt = resultTxt;
                draft.resultModalOpen = true;
            });
        }
    }, [gameStatus, oppAttemptList]);

    const keyBoardEnabled = useMemo(() => {
        if (!playersReady || gameStatus !== GameStatus.PLAYING || oppGameStatus !== GameStatus.PLAYING) return false;
        return true;
    }, [gameStatus, playersReady, oppGameStatus]);

    const onSubmit = () => {
        if (!socketRef.current) return;
        socketRef.current.emit('submitAttempt', { gameId: params?.gameId, attempts: attemptList });
    };

    const onRestart = () => {
        window.location.href = `/game/${generateGameId()}`;
    };

    const onPlaySolo = () => {
        navigate('/');
    };

    const handleStartGame = () => {
        if (!socketRef.current) return;
        socketRef.current.emit('gameStart', { gameId: params?.gameId });
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
            <ResultModal
                open={result.resultModalOpen}
                onRestart={onRestart}
                title={result.resultTxt}
                onPlaySolo={onPlaySolo}
            />
            <RuleModal open={ruleModalOpen} playersReady={playersReady} startGame={handleStartGame} />
        </>
    );
};

export default PlayersBoard;
