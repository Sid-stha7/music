import logo from './logo.svg';
import './App.css';
import Player from "./component/Player";
import Login from "./component/Login";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Player />
          {/*<Login />*/}
      </header>
    </div>
  );
}

export default App;
