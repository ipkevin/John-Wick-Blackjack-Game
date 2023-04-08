import React from "react";
import {useSound} from 'use-sound';

import shuffleSound from "./assets/sounds/shuffling.ogg"
import flipCardSound from "./assets/sounds/flip_card.ogg";

import Moves from "./components/Moves/Moves";
import Dealer from "./components/Dealer/Dealer";
import Player from "./components/Player/Player";
import PhaseName from "./components/PhaseName/PhaseName";

import "./Board.scss";

export function BlackjackBoard({ ctx, G, moves }) {

    const [playShuffle] = useSound(shuffleSound);
    const [playFlipCard] = useSound(flipCardSound);

    let phaseTitle = "";
    switch (ctx.phase) {
        case "betting":
            phaseTitle = "Place your bets";
            break;
        case "playing":
            phaseTitle = "Play";
            break;
        case "finishing":
            phaseTitle = "Results";
            break;
        default:
            break;
   };

    // const onClick = (id) => moves.clickCell(id);

    // let winner = '';
 
    // if (ctx.gameover) {
    //     winner = ctx.gameover.winner !== undefined ? (
    //         <div id="winner">Winner: {ctx.gameover.winner}</div>
    //     ) : ( <div id="winner">Draw!</div>);
    // }


    // shorter varname as it's used throughout code
    // Actually might not use this as much in local multiplayer since some UI items need to remain tied to certain player.
    let currPlayerObj = G.allPlayers[ctx.currentPlayer];


    // Intended to be used to end the dealer phase after a pause (otherwise use would have to press a button)
    function endDealerAutomatic() {
            playFlipCard(); // play the shuffle sound
            setTimeout(() => {
                moves.endDealerDealing();
            }, 2000);
    }

// console.log("type of playorderpos then numMoves", typeof(ctx.playOrderPos), typeof(ctx.numMoves));

    return (
        <div className="main">
            <div className="bgtable">

            <div className="stacked__wrapper">
                <h3 className="stacked">R</h3>
            </div>

            <div className="result__wrapper-outer">
                <div className="result__wrapper result__wrapper-w">
                <h3 className="result result-0">W</h3>
                <h3 className="result result-1">W</h3>
                <h3 className="result result-2">W</h3>
                <h3 className="result result-3">W</h3>
                </div>
                <div className="result__wrapper result__wrapper-i">
                <h3 className="result result-0">I</h3>
                <h3 className="result result-1">I</h3>
                <h3 className="result result-2">I</h3>
                <h3 className="result result-3">I</h3>
                </div>
                <div className="result__wrapper result__wrapper-n1">
                <h3 className="result result-0">N</h3>
                <h3 className="result result-1">N</h3>
                <h3 className="result result-2">N</h3>
                <h3 className="result result-3">N</h3>
                </div>
                <div className="result__wrapper result__wrapper-n2">
                <h3 className="result result-0">N</h3>
                <h3 className="result result-1">N</h3>
                <h3 className="result result-2">N</h3>
                <h3 className="result result-3">N</h3>
                </div>
                <div className="result__wrapper result__wrapper-e">
                <h3 className="result result-0">E</h3>
                <h3 className="result result-1">E</h3>
                <h3 className="result result-2">E</h3>
                <h3 className="result result-3">E</h3>
                </div>
                <div className="result__wrapper result__wrapper-r">
                <h3 className="result result-0">R</h3>
                <h3 className="result result-1">R</h3>
                <h3 className="result result-2">R</h3>
                <h3 className="result result-3">R</h3>
                </div>
            </div>

            
                {/* <table id="board">
        <tbody>{tbody}</tbody>
        </table>
    {winner} */}
                {/* {logItOut(G, ctx)} */}
                <div className="game-info">
                    <p>The current phase is: {ctx.phase}</p>
                    {ctx.phase !== "dealingtodealer" ? <p>The current player is: {ctx.currentPlayer}</p> : ""}
                </div>
                <Dealer dealerObj={G.dealer} ctx={ctx} />
                <PhaseName phaseTitle={phaseTitle} phase={ctx.phase} />
                <div className="restofpage">
                    {ctx.phase === "playing" && ctx.playOrderPos === 0 && ctx.numMoves === 0 ? <>{playShuffle()}</> : ""}
                    {ctx.phase === "dealingtodealer" ? <>{endDealerAutomatic()}</> : ""}
                </div>

                {ctx.playOrder.map((player, index) => {
                    return (
                        <Player key={index} currPlayerObj={G.allPlayers[player]} ctx={ctx} index={index} theDealer={G.dealer} />
                    );
                })}
                <Moves currPlayerObj={currPlayerObj} moves={moves} ctx={ctx} />
            </div>
        </div>
    );
}
