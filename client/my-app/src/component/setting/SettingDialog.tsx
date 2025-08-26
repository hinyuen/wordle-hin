import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useBackgroundContext } from '../background/context';
import { useMemo } from 'react';
import { BASE_ANSWER, BASE_ATTEMPT_OBJ, BASE_ATTEMPTS, wordsList } from '../../util';
import { GameStatus } from '../mainboard/type';

export type SettingDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

const SettingDialog = ({ open = false, setOpen }: SettingDialogProps) => {
    const { setAttemptList, attemptList, answer, setAnswer, gameStatus } = useBackgroundContext();

    const attemptRounds = useMemo(() => {
        if (!attemptList || !attemptList.length) return BASE_ATTEMPTS;
        return attemptList.length;
    }, [attemptList]);

    const updateAttemptList = (v: number) => {
        if (v < 5) return;
        setAttemptList(
            Array.from({ length: v }, () => ({
                ...BASE_ATTEMPT_OBJ,
            }))
        );
    };

    const disabledSetting = useMemo(() => {
        if ([GameStatus.WON, GameStatus.LOSE].includes(gameStatus)) return false;
        const firstAttempt = attemptList[0];
        const isUserStarted = firstAttempt.selection.some((item) => item.letter.length > 0);
        return isUserStarted;
    }, [gameStatus, attemptList]);

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
            <DialogContent>
                <div style={{ margin: 5, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label style={{ width: 160 }}>Number of attempts:</label>
                    <input
                        disabled={disabledSetting}
                        type="number"
                        min={5}
                        value={attemptRounds}
                        style={{
                            width: '200px',
                            padding: '10px 14px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#1976d2')}
                        onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                        onChange={(e) => updateAttemptList(Number(e.target.value))}
                    />
                    <button onClick={() => console.log(wordsList)}>log</button>
                </div>
                <div style={{ margin: 5, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label style={{ width: 160 }}>Answer:</label>
                    <select
                        disabled={disabledSetting}
                        value={answer}
                        style={{
                            width: '200px',
                            padding: '10px 14px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            appearance: 'none', // removes default arrow for more custom styling
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#1976d2')}
                        onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                        onChange={(e) => setAnswer(e.target.value)}
                    >
                        {BASE_ANSWER.map((word) => (
                            <option key={word} value={word}>
                                {word}
                            </option>
                        ))}
                    </select>
                </div>
            </DialogContent>
            <DialogActions>
                <Button style={{ color: 'white' }} onClick={() => setOpen(false)}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingDialog;
