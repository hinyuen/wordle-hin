import React from 'react';
import Setting from '../setting/Setting';
import { BackgroundContext } from './context';
import useGameSetUp from '../../hooks/useGameSetUp';
import { Snackbar } from '@mui/material';

export const Background: React.FC<React.PropsWithChildren<{ isMulti?: boolean }>> = ({ children, isMulti = false }) => {
    const {
        answer,
        setAnswer,
        attemptList,
        setAttemptList,
        gameStatus,
        setGameStatus,
        getAnswer,
        validateSelection,
        enableSubmit,
        deleteKey,
        insertKey,
        saveSelectedKey,
        selectedKey,
        setSelectedKey,
        setOppAttemptList,
        oppAttemptList,
        oppGameStatus,
        setOppGameStatus,
        oppSelectedKey,
        setOppSelectedKey,
        saveOppSelectedKey,
        setSnackbarState,
        snackbarState,
    } = useGameSetUp();

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <BackgroundContext.Provider
                value={{
                    setAnswer,
                    answer,
                    attemptList,
                    setAttemptList,
                    gameStatus,
                    setGameStatus,
                    getAnswer,
                    validateSelection,
                    enableSubmit,
                    deleteKey,
                    insertKey,
                    saveSelectedKey,
                    selectedKey,
                    setSelectedKey,
                    setOppAttemptList,
                    oppAttemptList,
                    oppGameStatus,
                    setOppGameStatus,
                    oppSelectedKey,
                    setOppSelectedKey,
                    saveOppSelectedKey,
                    setSnackbarState,
                    snackbarState,
                }}
            >
                <Setting isMulti={isMulti} />
                <Snackbar
                    style={{ color: 'white' }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={snackbarState.open}
                    autoHideDuration={3500}
                    onClose={() =>
                        setSnackbarState((draft) => {
                            draft.open = false;
                        })
                    }
                    message={snackbarState.message}
                />
                {children}
            </BackgroundContext.Provider>
        </div>
    );
};

export default Background;
