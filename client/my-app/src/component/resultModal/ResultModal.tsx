import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { COLOR } from '../../util';

const ResultModal = ({ open = false, onRestart, title, onPlaySolo }) => {
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
            <DialogTitle>{title}</DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    style={{ backgroundColor: COLOR.secondary, color: 'white' }}
                    onClick={onPlaySolo}
                >
                    Play Solo Game
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: COLOR.primary, color: 'white' }}
                    onClick={onRestart}
                >
                    Restart
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResultModal;
