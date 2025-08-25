import { LetterData } from '../mainboard/type';
import './charSelectionRow.css';

export const BASE_LIST = ['', '', '', '', ''];

export type CharSelectionRowProps = {
    selections: LetterData[];
};

const CharSelectionRow = ({ selections }: CharSelectionRowProps) => {
    return (
        <div className="char-selection-row">
            {selections.map((selection, i) => (
                <div className="char-selection" key={`${selection.letter}-${i}`}>
                    {selection.letter}
                </div>
            ))}
        </div>
    );
};

export default CharSelectionRow;
