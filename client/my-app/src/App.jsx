import './App.css';
import MainBoard from './component/mainboard/MainBorad';

function App() {
    return (
        <Background>
            <MainBoard />
        </Background>
    );
}

export const Background = ({ children }) => {
    return <div style={{ width: '100%', height: '100vh' }}>{children}</div>;
};

export default App;
