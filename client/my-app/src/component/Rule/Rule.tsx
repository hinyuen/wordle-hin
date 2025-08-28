import { Button } from '@mui/material';

const MultiRule = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <h2>You know the drill. </h2>
            <h2> 1 word, 5 letters, 6 guesses. </h2>
            <h2>Can you beat your friends?</h2>
            <Button variant="contained" size="large">
                Play Now
            </Button>
        </div>
    );
};

export default MultiRule;
