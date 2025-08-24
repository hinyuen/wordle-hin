import './charSelectionRow.css';

const BASE_LIST = ['', '', '', '', ''];

const CharSelectionRow = ({ selections = BASE_LIST }) => {
    return (
        <div className="char-selection-row">
            {selections.map((selection) => (
                <div className="char-selection" key={selection}>
                    {selection}
                </div>
            ))}
        </div>
    );
};

export default CharSelectionRow;
