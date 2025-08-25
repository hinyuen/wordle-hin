import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useBackgroundContext } from '../background/context';

export type SettingDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

const SettingDialog = ({ open = false, setOpen }: SettingDialogProps) => {
    const { setAnswerOptions, answerOptions } = useBackgroundContext();
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
                style: {
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                },
            }}
        >
            <DialogTitle>Settings</DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions>
                {/* <Button onClick={() => setOpen(false)}>Close</Button> */}
                <Button style={{ color: 'white' }}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingDialog;
