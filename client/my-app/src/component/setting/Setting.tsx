import { IconButton } from '@mui/material';
import { Settings } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import './setting.css';
import SettingDialog from './SettingDialog';
import { useState } from 'react';

const Setting = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    return (
        <div className="setting-wrapper">
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
