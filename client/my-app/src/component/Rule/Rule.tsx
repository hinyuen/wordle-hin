import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { generateGameId } from '../../util';

export const RuleText = () => {
    return (
        <>
            <h2>You know the drill. </h2>
            <h2> 1 word, 5 letters, 5 guesses. </h2>
            <h2>Can you beat your friends?</h2>
        </>
    );
};

const MultiRule = () => {
    const navigate = useNavigate();
    const navigateToGame = () => {
        const gameId = generateGameId();
        navigate(`/game/${gameId}`);
    };
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <RuleText />
            <Button variant="contained" size="large" onClick={navigateToGame}>
                Play Now
            </Button>
        </div>
    );
};

export default MultiRule;
