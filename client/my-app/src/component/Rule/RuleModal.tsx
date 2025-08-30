import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { RuleText } from './Rule';

const RuleModal = ({ open = false, setOpen }) => {
    return (
        <Dialog
            open={open}
            // onClose={() => setOpen(false)}
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
                <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RuleModal;
