import React from 'react';
import './key.css';
import { ResultType } from '../../type';
type KeyProps = {
    // other props here if needed
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: ResultType;
};
const Key = ({ children, onClick, disabled = false, type }: KeyProps) => {
    return (
        <button className={`key-${type}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Key;
