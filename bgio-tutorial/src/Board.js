import React from "react";
import { v4 as uuid } from "uuid";
import {useEffect, useState} from 'react';

import GetHand from "./components/GetHand/GetHand";
import Moves from "./components/Moves/Moves";
import Dealer from "./components/Dealer/Dealer";
import Player from "./components/Player/Player";
import PhaseName from "./components/PhaseName/PhaseName";

import "./Board.scss";

export function BlackjackBoard({ ctx, G, moves }) {

    const [phaseTitle, setPhaseTitle] = useState("");

    // Did this hoping I could stop the <Player> from re-rendering everytime hit button, but it didn't work
    // So player re-rendered even though playerLIst definitely stble.
    // The component redraws even if I don't use map and don't use any G/ctx state vars that are changing. 
    // So basically the components always seem to redraw in this output 
    const [playerList, setPlayerList] = useState([]);

    useEffect(() => {
        setPlayerList(ctx.playOrder);
        console.log("first render useEffect in Board running");
    }, []);

    useEffect(()=> {
        switch (ctx.phase) {
            case "betting":
                setPhaseTitle("Place your bets");
                break;
            case "playing":
                setPhaseTitle("Play");
                break;
            case "finishing":
                setPhaseTitle("Results");
                break;
            default:
                break;
        };
    }, [ctx.phase])
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
        setTimeout(() => {
            moves.endDealerDealing();
        }, 2300);
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
                <PhaseName phaseTitle={phaseTitle} phase={ctx.phase} />
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

                </div>

                {/* <Player currPlayerObj={G.allPlayers[0]}  index={0} />
                <Player currPlayerObj={G.allPlayers[1]}  index={1} /> */}
                {playerList.map((player, index) => {
                    return (
                        <Player currPlayerObj={G.allPlayers[player]} ctx={ctx} index={index} />
                        // <p key={uuid()}>
                        // Player {player}: {getBetAndBank(G.allPlayers[player])}
                        // </p>
                    );
                })}

                {/* <Player currPlayerObj={currPlayerObj} ctx={ctx} G={G} /> */}
                {/* {insertMoves()} */}
                <Moves currPlayerObj={currPlayerObj} moves={moves} ctx={ctx} />
            </div>
        </div>
    );
}
