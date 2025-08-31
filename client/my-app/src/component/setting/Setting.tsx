import { IconButton } from '@mui/material';
import { Settings } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import './setting.css';
import SettingDialog from './SettingDialog';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const Setting = ({ isMulti }: { isMulti: boolean | undefined }) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const btnText = useMemo(() => {
        if (location.pathname === '/multiplayer') {
            return 'Play solo game!';
        }
        return 'Challenge Your Friend!';
    }, [location.pathname]);

    const playModeBtnTxt = useMemo(() => {
        if (location.pathname === '/absurdle') {
            return 'Normal';
        }
        return 'Absurdle';
    }, [location.pathname]);

    const handlePlayModeChange = () => {
        const target = location.pathname === '/absurdle' ? '/' : '/absurdle';
        navigate(target);
    };

    if (isMulti) return null; // disable settings for multiplayer mode

    return (
        <div className="setting-wrapper">
            <button style={{ marginRight: '0.5rem' }} onClick={handlePlayModeChange}>
                {playModeBtnTxt}
            </button>
            <button
                onClick={() => {
                    let target = '/multiplayer';
                    if (location.pathname === '/multiplayer') {
                        target = '/';
                    }
                    navigate(target);
                }}
            >
                {btnText}
            </button>
            <Tooltip title="Settings">
                <IconButton
                    aria-label="settings"
                    size="large"
                    style={{ color: 'white' }}
                    onClick={() => setOpenDialog(true)}
                >
                    <Settings />
                </IconButton>
            </Tooltip>
            <SettingDialog open={openDialog} setOpen={setOpenDialog} />
        </div>
    );
};

export default Setting;
