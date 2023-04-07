import { Client } from 'boardgame.io/react';
import {Blackjack} from './Game';
import {BlackjackBoard} from './Board';
import './App.scss';

// import {TicTacToeBoard} from './Board';

// Initially they had a const equal to the Client class.  This is related to old style React components built by class vs built by functions
// The Client object prob has a render function in it, so it must be delcared this way wiht App as a const assigned to it rather than declaring App as a function.
// YES, it is class.  Console.log App to see what Client returned!
// As you can see below, I also tried a variant.  Assigned Client() return to a separate var, Game.  Then in the App() function, I rendered the <Game /> component.  That works.

// const App = Client({game: TicTacToe});

const Game = Client({game: Blackjack, board: BlackjackBoard, debug: false, numPlayers: 3});
// const Game = Client({game: TicTacToe, board: TicTacToeBoard, numPlayers: 2});

function App() {
  return (
    <Game />
  )
}

export default App;