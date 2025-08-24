import React from 'react';

type KeyProps = {
    // other props here if needed
    children: React.ReactNode;
    onClick?: () => void;
};
const Key = ({ children, onClick }: KeyProps) => {
    return <button onClick={onClick}>{children}</button>;
};

export default Key;
