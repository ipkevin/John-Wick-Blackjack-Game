import React from 'react';



export function BlackjackBoard({ ctx, G, moves}) {

    // const onClick = (id) => moves.clickCell(id);

    // let winner = '';
    // if (ctx.gameover) {
    //     winner = ctx.gameover.winner !== undefined ? (
    //         <div id="winner">Winner: {ctx.gameover.winner}</div>
    //     ) : ( <div id="winner">Draw!</div>);
    // }

    // const cellStyle = {
    //     border: '1px solid #555',
    //     width: '50px',
    //     height: '50px',
    //     lineHeight: '50px',
    //     textAlign: 'center',
    // };

    // let tbody = [];
    // for (let i = 0; i < 3; i++) {
    //     let cells = [];
    //     for (let j = 0; j < 3; j++) {
    //         const id = 3 * i + j;
    //         cells.push(
    //             <td key={id}>
    //                 {G.cells[id] ? (
    //                     <div style={cellStyle}>{G.cells[id]}</div>
    //                 ) : (
    //                     <button style={cellStyle} onClick={() => onClick(id)} />
    //                 )}
    //             </td>
    //         );
    //     }
    //     tbody.push(<tr key={i}>{cells}</tr>);
    // }

    function handleBet() {
        moves.bet(100);
    }
    function handleHit() {
        moves.hit();
    }
    function handleStand() {
        moves.stand();
    }
    function displayCards(){
        let hands = [];
        // let dealerCards = "<p>Dealer cards: ${G.dealerHand[0]}, ${G.secret.dealerCard}<p>";
        let playerCards = ctx.playOrder.map((player) => {
            return (JSON.stringify(G.allPlayers[player]));
        });
        // hands.push(dealerCards);
        hands.push(playerCards);
        return hands;
    }

    console.log("here are ctx: ", JSON.stringify(ctx));
    console.log("here are moves: ", (moves));
    const insertMoves = () => {

        if (ctx.phase === "betting") {
            return (<button onClick={handleBet}>Bet</button>);
        } else if (ctx.phase === "playing") {
            return (
                <>
                    <button onClick={handleHit}>Hit</button>
                    <button onClick={handleStand}>Stand</button>
                </>
            )
        }
    };
    return (
    <div>
      {/* <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      {winner} */}
      <p>The current phase is: {ctx.phase}</p>
      <p>The current player is: {ctx.currentPlayer}</p>
      <p>Your moves:</p>
      {/* {insertMoves()} */}
      {(ctx.phase === "betting") ? <button onClick={handleBet}>Bet</button> : ""}
      <p></p>

      {/* {(ctx.phase === "playing") ? <p>{displayCards()}</p> : ""} */}
      
      
    </div>
    );
}