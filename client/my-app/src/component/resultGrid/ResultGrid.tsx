import { GameStatus } from '../mainboard/type';

export type ResultGridProps = {
    gameStatus: GameStatus;
    onRestart: () => void;
};

const ResultGrid = ({ gameStatus, onRestart }: ResultGridProps) => {
    if (gameStatus === GameStatus.PLAYING) return null;
    return (
        <div>
            Result: {gameStatus === GameStatus.WON ? 'You Won!' : 'You Lost!'}
            <div>
                <button onClick={onRestart}>Restart</button>
            </div>
        </div>
    );
};

export default ResultGrid;
