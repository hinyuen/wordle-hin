import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { RuleText } from './Rule';

const RuleModal = ({ open = false, playersReady = false, startGame }) => {
    const btnText = playersReady ? 'Start Game' : 'Waiting for other player...';

    const handleCopy = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(window.location.href)
                .then(() => {
                    alert('Link copied to clipboard!');
                })
                .catch(() => {
                    alert('Failed to copy link.');
                });
        } else {
            alert(
                'Clipboard API not supported in this browser. Please copy the link manually: ' + window.location.href
            );
        }
    };

    return (
        <Dialog
            open={open}
            PaperProps={{
                style: {
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                },
            }}
        >
            <DialogTitle>Game Rules</DialogTitle>
            <DialogContent>
                <RuleText />
            </DialogContent>
            <DialogActions>
                <Button
                    style={{ backgroundColor: !playersReady ? 'rgb(86, 86, 201)' : 'grey', color: 'white' }}
                    onClick={handleCopy}
                    disabled={playersReady}
                >
                    Share Link
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: 'rgb(58,58,60)', color: 'white' }}
                    disabled={!playersReady}
                    onClick={startGame}
                >
                    {btnText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RuleModal;
