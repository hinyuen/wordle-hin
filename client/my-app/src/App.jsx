import './App.css';
import CharSelection from './component/charSelectionRow/CharSelectionRow';
import KeyBoard from './component/keyboard/Keyboard';
// import { useImmer } from 'use-immer';

function App() {
    // const [state, setState] = useImmer('');
    return (
        <Background>
            <h1>Hin's Wordle</h1>
            <div style={{ marginBottom: '1rem' }}>
                <CharSelection />
                <CharSelection />
                <CharSelection />
                <CharSelection />
                <CharSelection />
            </div>
            <KeyBoard onClick={(key) => console.log(key)} />
        </Background>
    );
}

export const Background = ({ children }) => {
    return <div style={{ width: '100%', height: '100vh' }}>{children}</div>;
};

export default App;
