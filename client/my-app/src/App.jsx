import './App.css';
import MainBoard from './component/mainboard/MainBorad';
import Background from './component/background/Background';

function App() {
    return (
        <Background>
            <MainBoard />
        </Background>
    );
}

export default App;
