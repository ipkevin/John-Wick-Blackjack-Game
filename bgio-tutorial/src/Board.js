import React from 'react';
import { v4 as uuid } from 'uuid';

import cardImages from './utils/CardImages';

import PlayerHand from './components/PlayerHand/PlayerHand';

import './Board.scss';

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
    function handleEndTurn(){
        console.log("current player about to be removed: ", ctx.currentPlayer);
        moves.endTurn();
    }
    function handleEndDealerDealing(){
        moves.endDealerDealing();
    }

    // Intended to be used to end the dealer phase after a pause (otherwise use would have to press a button)
    function endDealerAutomatic() {
        console.log("In endDealerAutomatic");
        setTimeout(() => {
            moves.endDealerDealing();
        }, 2000);
    }
    // Hash table to quickly lookup name of card
    const cardNames = {
        "1": "ace",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
        "11": "jack",
        "12": "queen",
        "13": "king"
    };

    // Returns an array of the names and suits of the cards in the player's hand
    function displayCards(playerObj){
        // let hands = [];
        // hands = playerObj.hand.map((card) => {
        //     let value = `${cardNames[card.rank].toLowerCase()}_of_${card.suit}.gif`; // cardNames[card.rank]+" of "+card.suit;
        //     console.log("here is the name of the card from displayCards(): ", value);
        //     return value;
        // });
        // return hands;
        let hands = [];
        hands = playerObj.hand.map((card) => {
            let value = `${card.suit}_${cardNames[card.rank].toLowerCase()}`; // cardNames[card.rank]+" of "+card.suit;
            // console.log("here is the name of the card from displayCards(): ", value);
            return value;
        });
        return hands;
        // let cards = "";
        // playerObj.hand.forEach((card) => {
        //     cards += `<img src="./src/assets/images/cards/${cardNames[card.rank].toLowerCase()}_of_${card.suit}.gif" />`; // cardNames[card.rank]+" of "+card.suit;
        //     console.log("here is the name of the card from displayCards(): ", cards);
        // });
        // return cards;
    }


    // Returns string holding bet and bank total of passed in player
    function getBetAndBank(playerObj){
        let moneyInfo = "Bet: "+playerObj.bet+" | Bank: " + playerObj.bank;
        return moneyInfo;
    }

    // Displays available moves for current phase
    const insertMoves = () => {

        if (ctx.phase === "betting") {
            return (<button onClick={handleBet}>Bet 100</button>);
        } else if (ctx.phase === "playing" && G.allPlayers[ctx.currentPlayer].busted === false) {
            return (
                <>
                    <button onClick={handleHit}>Hit</button>
                    <button onClick={handleStand}>Stand</button>
                </>
            )
        } else if (ctx.phase === "playing" && G.allPlayers[ctx.currentPlayer].busted === true){
            return (
                <>
                    <button onClick={handleEndTurn}>OK</button>
                </>
            )
        } else if (ctx.phase === "dealingtodealer") {
            return (
                <>
                    <button onClick={handleEndDealerDealing}>Continue</button>
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

    function logItOut(G, ctx) {
        console.log("This is G: ", G);
        console.log("This is ctx: ", ctx);
    }


    /******************
     * Jim provided this to show how React States could be used to draw out cards one by one when the card array is updated
     * https://codesandbox.io/s/nice-goldstine-0r56bd?file=/src/App.js
     * Also note how he did the setstate/draw inside the setTimeout
     * BUT ACTUALLY, this is redrawing the entire card deck over and over.  It's just that it's one longer each time so it 
     * looks step-by-step.  
     * BUT NO, it is diff from yours since at least it's drawing each item with a delay betwwn based on incrementing #.
     * 
     * for yours, could be way easier. Get the hand array to render.
     *  - iterate thru one by one
     *  - each time review the array, if not arraylen=1 and if last item, then draw with animation. Else, draw immediately.
     **********************/
    return (
    <div>
      {/* <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      {winner} */}
      {logItOut(G, ctx)}
      {(ctx.phase === "dealingtodealer") ? <>{endDealerAutomatic()}</> : ""}
      <p>The current phase is: {ctx.phase}</p>
      {(ctx.phase !== "dealingtodealer") ? <p>The current player is: {ctx.currentPlayer}</p> : ""}
      {(ctx.phase === "finishing") ? <p>Result: {G.allPlayers[ctx.currentPlayer].resultMessage}</p> : ""}
      {(ctx.phase === "finishing") ? <p>Dealer total: {G.dealer.handValue} {(G.dealer.hasBJ) ? "(blackjack)" : ""} Your total: {G.allPlayers[ctx.currentPlayer].handValue} {(G.allPlayers[ctx.currentPlayer].hasBJ) ? "(blackjack)" : ""}</p> : ""}
      {(ctx.phase === "playing" || ctx.phase === "dealingtodealer" || ctx.phase === "finishing") ? 
      <p>Dealer cards: 
        {(ctx.phase === "dealingtodealer") ? <PlayerHand playerObj={G.dealer} phase="dealingtodealer" /> :  <PlayerHand playerObj={G.dealer} />}
        </p>
      : ""}
      {(ctx.phase === "finishing") ? 
        <p>Your hand: <PlayerHand playerObj={G.allPlayers[ctx.currentPlayer]} /></p>
        // <p>Your cards: {displayCards(G.allPlayers[ctx.currentPlayer]).map(element => 
        // (<img className="card" src={cardImages[element]} alt={`${element} card`} key={uuid()} />)
        // )}</p>
      : ""}
      <p>Your moves:</p>
      {insertMoves()}
        {(ctx.phase === "playing") ?
            <p>Your cards: <PlayerHand playerObj={G.allPlayers[ctx.currentPlayer]} phase="playing" /></p>
            // <p>Your cards: {displayCards(G.allPlayers[ctx.currentPlayer]).map(element => 
            // (<img className="card" src={cardImages[element]} alt={`${element} card`} key={uuid()} />)
            // )}</p>
        : ""}
    {ctx.playOrder.map((player) => {
        return (<p>Player {player}: {getBetAndBank(G.allPlayers[player])}</p>)
    })}
      
    </div>
    );
}