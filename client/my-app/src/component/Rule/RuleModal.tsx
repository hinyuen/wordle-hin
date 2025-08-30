import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { RuleText } from './Rule';
import { COLOR } from '../../util';

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
                    backgroundColor: COLOR.background,
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
                    style={{ backgroundColor: !playersReady ? COLOR.secondary : 'grey', color: 'white' }}
                    onClick={handleCopy}
                    disabled={playersReady}
                >
                    Share Link
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: COLOR.primary, color: 'white' }}
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
