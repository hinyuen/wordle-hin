import Key from '../key/Key';
import { ResultType } from '../mainboard/type';
import './keyboard.css';

const firstRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const secondRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const thirdRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

type KeyBoardProps = {
    insertKey: (key: string) => void;
    deleteKey: () => void;
    onSubmit: () => void;
    enableSubmit: boolean;
    selectedKey: Map<string, ResultType>;
};

const KeyBoard = ({ insertKey, deleteKey, onSubmit, enableSubmit, selectedKey }: KeyBoardProps) => {
    const getKeyType = (key: string): ResultType => {
        if (!selectedKey.has(key)) return ResultType.EMPTY;
        const selected = selectedKey.get(key);
        if (selected) return selected;
        return ResultType.EMPTY;
    };

    return (
        <div>
            <div className="key-wrapper">
                {firstRow.map((key) => {
                    return (
                        <Key key={key} onClick={() => insertKey(key)} type={getKeyType(key)}>
                            {key}
                        </Key>
                    );
                })}
            </div>
            <div className="key-wrapper">
                {secondRow.map((key) => (
                    <Key key={key} onClick={() => insertKey(key)} type={getKeyType(key)}>
                        {key}
                    </Key>
                ))}
            </div>
            <div className="key-wrapper">
                <Key key="Enter" onClick={onSubmit} disabled={!enableSubmit}>
                    Enter
                </Key>
                {thirdRow.map((key) => (
                    <Key key={key} onClick={() => insertKey(key)} type={getKeyType(key)}>
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
