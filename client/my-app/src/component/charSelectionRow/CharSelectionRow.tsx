import './charSelectionRow.css';

export const BASE_LIST = ['', '', '', '', ''];

const CharSelectionRow = ({ selections = BASE_LIST }) => {
    return (
        <div className="char-selection-row">
            {selections.map((selection, i) => (
                <div className="char-selection" key={`${selection}-${i}`}>
                    {selection}
                </div>
            ))}
        </div>
    );
};

export default CharSelectionRow;
