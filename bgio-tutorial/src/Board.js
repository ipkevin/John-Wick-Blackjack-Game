import React from "react";
import { v4 as uuid } from "uuid";

import GetHand from "./components/GetHand/GetHand";
import Moves from "./components/Moves/Moves";
import Dealer from "./components/Dealer/Dealer";

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

    

    // function logItOut(G, ctx) {
    //     console.log("This is G: ", G);
    //     console.log("This is ctx: ", ctx);
    // }


    return (
        <div className="main">
            <div className="bgtable">
                {/* <table id="board">
        <tbody>{tbody}</tbody>
        </table>
    {winner} */}
                {/* {logItOut(G, ctx)} */}
                <Dealer dealerObj={G.dealer} ctx={ctx} />

                <div className="restofpage">
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

                    {ctx.phase === "finishing" ? (
                        <p>
                            Your hand: <GetHand playerObj={currPlayerObj} />
                        </p>
                    ) : (
                        ""
                    )}
                    {currPlayerObj.busted === true ? <p>*** BUSTED ***</p> : ""}
                    {currPlayerObj.hasBJ === true ? <p>*** BLACKJACK ***</p> : ""}
                  
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

                    {/* {insertMoves()} */}
                    <Moves currPlayerObj={currPlayerObj} moves={moves} ctx={ctx} />
                </div>
            </div>
        </div>
    );
}
