import { useParams } from 'react-router';
import Background from '../../component/background/Background';
import { useEffect, useState } from 'react';
import RuleModal from '../../component/Rule/RuleModal';
import { io } from 'socket.io-client';
import { BASE_API_URL } from '../../util';

const PlayersBoard = () => {
    const params = useParams();
    const [open, setOpen] = useState(true);
    console.log('params => ', params);

    useEffect(() => {
        if (!params) return;
        const { gameId } = params;
        const socket = io(BASE_API_URL);
        socket.on('connect', () => {
            console.log('Connected:', socket.id);
            socket.emit('join', { gameId });
        });

        socket.on('ready', () => {
            // Handle ready event
        });

        return () => {
            socket.disconnect();
        };
    }, [params]);

    return (
        <Background isMulti={true}>
            <h1>Players Board</h1>
            <h1>Player 1: 3 guesses</h1>
            <h1>Player 2: 5 guesses</h1>
            <RuleModal open={open} setOpen={setOpen} />
        </Background>
    );
};

export default PlayersBoard;
