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
    function handleOK(){
        moves.OK();
    }
    function handleBuyCredits(){
        moves.getChips();
    }
    // Hash table to quickly lookup name of card
    const cardNames = {
        "1": "Ace",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
        "11": "Jack",
        "12": "Queen",
        "13": "King"
    };

    // Returns an array of the names and suits of the cards in the player's hand
    function displayCards(playerObj){
        let hands = [];
        hands = playerObj.hand.map((card) => {
            let value = cardNames[card.rank]+" of "+card.suit;
            console.log("here is the name of the card from displayCards(): ", value);
            return value;
        });
        return hands;
    }

    // Returns string holding bet and bank total of passed in player
    function getBetAndBank(playerObj){
        let moneyInfo = "Bet: "+playerObj.bet+" | " + playerObj.bank;
        return moneyInfo;
    }

    // Displays available moves for current phase
    const insertMoves = () => {

        if (ctx.phase === "betting") {
            return (<button onClick={handleBet}>Bet 100</button>);
        } else if (ctx.phase === "playing") {
            return (
                <>
                    <button onClick={handleHit}>Hit</button>
                    <button onClick={handleStand}>Stand</button>
                </>
            )
        } else if (ctx.phase === "finishing") {
            return (
                <>
                    <button onClick={handleOK}>OK</button>
                    <button onClick={handleBuyCredits}>Buy 1000 Chips</button>
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
      {(ctx.phase === "finishing") ? <p>Result: {G.allPlayers[ctx.currentPlayer].resultMessage}</p> : ""}
      {(ctx.phase === "finishing") ? <p>Dealer total: {G.dealer.handValue} {(G.dealer.hasBJ) ? "(blackjack)" : ""} Your total: {G.allPlayers[ctx.currentPlayer].handValue} {(G.allPlayers[ctx.currentPlayer].hasBJ) ? "(blackjack)" : ""}</p> : ""}
      {(ctx.phase === "finishing" || ctx.phase === "playing") ? 
      <p>Dealer cards: {displayCards(G.dealer).map(element => element + ", ")}</p>
      : ""}
      {(ctx.phase === "finishing") ? 
      <p>Your cards: {displayCards(G.allPlayers[ctx.currentPlayer]).map(element => element + ", ")}</p>
      : ""}
      <p>Your moves:</p>
      {insertMoves()}
      {(ctx.phase === "playing") ?
      <p>Your cards: {displayCards(G.allPlayers[ctx.currentPlayer]).map(element => element + ", ")}</p>
        : ""}
    {ctx.playOrder.map((player) => {
        return (<p>Player {player}: {getBetAndBank(G.allPlayers[player])}</p>)
    })}
      

      {/* {(ctx.phase === "playing") ? <p>{displayCards()}</p> : ""} */}
      
      
    </div>
    );
}