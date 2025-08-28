import './SingleBoard.css';
import MainBoard from '../../component/mainboard/MainBorad';
import Background from '../../component/background/Background';

function SingleBoard() {
    return (
        <Background>
            <MainBoard />
        </Background>
    );
}

export default SingleBoard;
