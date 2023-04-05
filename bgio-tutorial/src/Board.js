import React from "react";
import { v4 as uuid } from "uuid";

import GetHand from "./components/GetHand/GetHand";

import "./Board.scss";

export function BlackjackBoard({ ctx, G, moves }) {
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

    // shorter varname as it's used throughout code
    let currPlayerObj = G.allPlayers[ctx.currentPlayer];

    function handleBet() {
        moves.bet(100);
    }
    function handleHit() {
        moves.hit();
    }
    function handleStand() {
        moves.stand();
    }
    function handleOK() {
        moves.OK();
    }
    function handleBuyCredits() {
        moves.getChips();
    }
    function handleEndTurn() {
        console.log("current player about to be removed: ", ctx.currentPlayer);
        moves.endTurn();
    }
    function handleEndDealerDealing() {
        moves.endDealerDealing();
    }

    // Intended to be used to end the dealer phase after a pause (otherwise use would have to press a button)
    function endDealerAutomatic() {
        setTimeout(() => {
            moves.endDealerDealing();
        }, 3000);
    }

    // Returns string holding bet and bank total of passed in player
    function getBetAndBank(playerObj) {
        let moneyInfo = "Bet: " + playerObj.bet + " | Bank: " + playerObj.bank;
        return moneyInfo;
    }

    // Displays available moves for current phase
    const insertMoves = () => {
        if (ctx.phase === "betting") {
            return (
                <button onClick={handleBet} key="handleBet">
                    Bet 100
                </button>
            );
        } else if (ctx.phase === "playing" && currPlayerObj.busted === false && currPlayerObj.hasBJ === false) {
            return (
                <>
                    <button onClick={handleHit} key="handleHit">
                        Hit
                    </button>
                    <button onClick={handleStand} key="handleStand">
                        Stand
                    </button>
                </>
            );
        } else if (ctx.phase === "playing" && (currPlayerObj.busted === true || currPlayerObj.hasBJ === true)) {
            console.log("in the insertMoves fxn, playing and busted/blackjack");
            return (
                <>
                    <button onClick={handleEndTurn} key="handleEndTurn">
                        OK
                    </button>
                </>
            );
        } else if (ctx.phase === "dealingtodealer") {
            return (
                <>
                    <button onClick={handleEndDealerDealing} key="handEndDealerDealing">
                        Continue
                    </button>
                </>
            );
        } else if (ctx.phase === "finishing") {
            return (
                <>
                    <button onClick={handleOK} key="handleOK">
                        OK
                    </button>
                    <button onClick={handleBuyCredits} key="handleBuyCredits">
                        Buy 1000 Chips
                    </button>
                </>
            );
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
            {ctx.phase === "dealingtodealer" ? <>{endDealerAutomatic()}</> : ""}
            <p>The current phase is: {ctx.phase}</p>
            {ctx.phase !== "dealingtodealer" ? <p>The current player is: {ctx.currentPlayer}</p> : ""}
            {ctx.phase === "finishing" ? <p>Result: {currPlayerObj.resultMessage}</p> : ""}
            {ctx.phase === "finishing" ? (
                <p>
                    Dealer total: {G.dealer.handValue} {G.dealer.hasBJ ? "(blackjack)" : ""} Your total: {currPlayerObj.handValue} {currPlayerObj.hasBJ ? "(blackjack)" : ""}
                </p>
            ) : (
                ""
            )}
            {ctx.phase === "playing" || ctx.phase === "dealingtodealer" || ctx.phase === "finishing" ? (
                <p>
                    Dealer cards:
                    {ctx.phase === "dealingtodealer" ? <GetHand playerObj={G.dealer} phase="dealingtodealer" /> : <GetHand playerObj={G.dealer} />}
                </p>
            ) : (
                ""
            )}
            {ctx.phase === "finishing" ? (
                <p>
                    Your hand: <GetHand playerObj={currPlayerObj} />
                </p>
            ) : (
                ""
            )}
            {currPlayerObj.busted === true ? <p>*** BUSTED ***</p> : ""}
            {currPlayerObj.hasBJ === true ? <p>*** BLACKJACK ***</p> : ""}
            <p>Your moves:</p>
            {insertMoves()}
            {ctx.phase === "playing" ? (
                <p>
                    Your cards: <GetHand playerObj={currPlayerObj} phase="playing" />
                </p>
            ) : (
                ""
            )}
            {ctx.playOrder.map((player) => {
                return (
                    <p key={uuid()}>
                        Player {player}: {getBetAndBank(G.allPlayers[player])}
                    </p>
                );
            })}
        </div>
    );
}
