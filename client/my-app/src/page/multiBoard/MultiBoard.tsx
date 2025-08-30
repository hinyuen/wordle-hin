import Background from '../../component/background/Background';
import PlayersBoard from '../../component/playersBoard/PlayersBoard';

const MultiBoard = () => {
    return (
        <Background isMulti>
            <PlayersBoard />
        </Background>
    );
};

export default MultiBoard;
