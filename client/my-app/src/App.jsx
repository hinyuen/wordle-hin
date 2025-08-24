import './App.css';
import KeyBoard from './component/keyboard/Keyboard';

function App() {
    return (
        <Background>
            <KeyBoard />
        </Background>
    );
}

export const Background = ({ children }) => {
    return <div style={{ width: '100%', height: '100vh' }}>{children}</div>;
};

export default App;
