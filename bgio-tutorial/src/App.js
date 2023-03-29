import { Client } from 'boardgame.io/react';
import {TicTacToe} from './Game';
import {TicTacToeBoard} from './Board';

// I THINK this is related to old style React components built by class vs built by functions
// The Client object prob has a render function in it, so it must be delcared this way wiht App as a const assigned to it rather than declaring App as a function.
// YES, it is class.  Console.log App to see what Client returned!
// As you can see below, I also tried a variant.  Assigned Client() return to a separate var, Game.  Then in the App() function, I rendered the <Game /> component.  That works.

// const App = Client({game: TicTacToe});

const Game = Client({game: TicTacToe, board: TicTacToeBoard,});
console.log("contents of Game: ", Game);

function App() {
  return (
    <Game />
  )
}

// function App()  {
//   return Client({game:TicTacToe});
// }

export default App;