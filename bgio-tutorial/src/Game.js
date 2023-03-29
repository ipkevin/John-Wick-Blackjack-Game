import {INVALID_MOVE} from 'boardgame.io/core';


function IsVictory(cells) {
    // So this will be passed the entire game 'board' (cells[])
    
    // positions are a set of 3 positions in the board that would be equal to a win
    const positions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    const isRowComplete = row => {
        // So row passed in will actually set of 3 positions in 
        // the cells[] that would be needed to win (ie, from positions[] array)
        // This creates an array (symbols) that stores what playerID is stored in those 3 positions
        // If this array contains the same playerID in all 3 indices, that means a single player managed to get a winning row (got all 3 positions of winning configuration)
        const symbols = row.map(i => cells[i]);
        // Below checks whether every element in symbols is the same. This means a player got every spot in a winning config (ie, got a winning config)
        // returns True if so
        return symbols.every(i => i !== null && i === symbols[0]);
    }
    // .some just means as long as it's true once, return true
    // cuz the first part returns an array where each index represents whether
    // a winner was found for each of the winning configurations.  If any one is true, that means won (ie, was in a winning config)
    return positions.map(isRowComplete).some(i => i === true);
}

// returns true if match is a draw (all cells filled)
function IsDraw(cells) {
    return cells.filter(c => c === null).length === 0;
}



export const TicTacToe = {
    setup: () => (
        {
        cells: Array(9).fill(null), 
        quit: null
        }
        ),

    moves: {
        clickCell: ({G, playerID}, id) => {
            if (G.cells[id] !== null) {
                return INVALID_MOVE;
            }
            G.cells[id] = playerID;
        },
        quitGame: ({G}) => {
            console.log("clicked quit!");
            G.quit = true;
            console.log("value of G.quit in quitGame move: ", G.quit);
        }
    },

    turn: {
        minMoves: 1,
        maxMoves: 1
    },

    
    endIf: ({G, ctx}) => {
        if (IsVictory(G.cells)) {
            // You know it's the current player because this endIf check is run after every state change (ie, move).  So if it found winner then it must have occurred during currentPlayer's move
            console.log("endif isVict check ran");
            return { winner: ctx.currentPlayer};
        }
        if (IsDraw(G.cells)) {
            console.log("endif isdraw check ran");
            return { draw:true };
        }
        if (G.quit === true) {
            alert("game over");
            console.log("endif quit check ran");
            // Must return something (even if it's "") in order for the game to actually end
            // NB: Game state does NOT actually reset!  But u can't keep playing either. So I guess u need to reset the game.
            return "you're a weiner";
        }
    }
}