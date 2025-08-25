import React from 'react';

type KeyProps = {
    // other props here if needed
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
};
const Key = ({ children, onClick, disabled = false }: KeyProps) => {
    return (
        <button onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Key;
