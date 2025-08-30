import { LetterData } from '../mainboard/type';
import './charSelectionRow.css';
export type CharSelectionRowProps = {
    selections: LetterData[];
    needHideAnswer: boolean;
};

const CharSelectionRow = ({ selections, needHideAnswer }: CharSelectionRowProps) => {
    return (
        <div className="char-selection-row">
            {selections.map((selection, i) => (
                <div className={`char-selection-${selection.type}`} key={`${selection.letter}-${i}`}>
                    {needHideAnswer ? '' : selection.letter}
                </div>
            ))}
        </div>
    );
};

export default CharSelectionRow;
