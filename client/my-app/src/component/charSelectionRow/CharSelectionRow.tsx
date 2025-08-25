import { LetterData } from '../mainboard/type';
import './charSelectionRow.css';
export type CharSelectionRowProps = {
    selections: LetterData[];
};

const CharSelectionRow = ({ selections }: CharSelectionRowProps) => {
    return (
        <div className="char-selection-row">
            {selections.map((selection, i) => (
                <div className={`char-selection-${selection.type}`} key={`${selection.letter}-${i}`}>
                    {selection.letter}
                </div>
            ))}
        </div>
    );
};

export default CharSelectionRow;
