import Key from '../key/Key';

const firstRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const secondRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const thirdRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

type KeyBoardProps = {
    insertKey: (key: string) => void;
    deleteKey: () => void;
    onSubmit: () => void;
    enableSubmit: boolean;
    answer: string;
};

const KeyBoard = ({ insertKey, deleteKey, onSubmit, enableSubmit, answer }: KeyBoardProps) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {firstRow.map((key) => (
                    <Key key={key} onClick={() => insertKey(key)}>
                        {key}
                    </Key>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {secondRow.map((key) => (
                    <Key key={key} onClick={() => insertKey(key)}>
                        {key}
                    </Key>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Key key="Enter" onClick={onSubmit} disabled={!enableSubmit}>
                    Enter
                </Key>
                {thirdRow.map((key) => (
                    <Key key={key} onClick={() => insertKey(key)}>
                        {key}
                    </Key>
                ))}
                <Key key="Delete" onClick={deleteKey}>
                    Delete
                </Key>
            </div>
        </div>
    );
};

export default KeyBoard;
