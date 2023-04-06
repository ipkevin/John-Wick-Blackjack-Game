import GetHand from '../GetHand/GetHand';
// import {v4 as uuid} from 'uuid';
import "./Player.scss";

import johnWick1 from '../../assets/images/portraits/johnwick.jpg';

// Returns string holding bet and bank total of passed in player
// function getBetAndBank(playerObj) {
//     let moneyInfo = "Bet: " + playerObj.bet + " | Bank: " + playerObj.bank;
//     return moneyInfo;
// }

/******************
 * 
 * ERROR: The cards for all players do the sweep in animation even when it's another player getting cards
 * Try to fix why that is.  Differences are that 1) I now show all hands on the screen instead of just current player's, and 
 * 2) I used to pass a currPlayerObj to Player that actually used the ctx.currentPlayer to determine. Now i pass a currPlayerObj that is actually
 * tied to a specific player
 * 
 */

export default function Player({currPlayerObj, ctx, index}){

    console.log("Player component being redrawn for player: ", index);
    
    // {ctx.playOrder.map((player) => {
    //     return (
    //         <p key={uuid()}>
    //             Player {player}: {getBetAndBank(G.allPlayers[player])}
    //         </p>
    //     );
    // })}
    console.log("type of ctx.currentplayer: ", typeof(ctx.currentPlayer));
    console.log("type of index: ", typeof(index));
    return (

        <>
        


        <div className={`player 
            ${(index === 0) ? "player__pos0" : ""}
            ${(index === 1) ? "player__pos1" : ""}
            ${(index === 2) ? "player__pos2" : ""}
            ${(ctx.currentPlayer === index.toString() && ctx.phase !== "dealingtodealer") ? "player--highlighted" : ""}
        `}>
            <div className="player__status">
                {currPlayerObj.busted === true ? <p>*** BUSTED ***</p> : ""}
                {currPlayerObj.hasBJ === true ? <p>*** BLACKJACK ***</p> : ""}
            </div>
      
            <div className="player__cards">
                {ctx.phase === "finishing" || ctx.phase === "dealingtodealer" ? (
                    <p>
                    <GetHand playerObj={currPlayerObj} />
                    </p>
                ) : "" }
                {ctx.phase === "playing" ? (
                    <p>
                    <GetHand playerObj={currPlayerObj} phase={ctx.currentPlayer == index ? "playing" : ""} />
                    </p>
                ) : (
                    ""
                )}
            </div>
            <div className="player__info-box">
                <div className="player__bet">
                Bet: {currPlayerObj.bet}
                </div>
                <div className="player__icon">
                    <img src={johnWick1} alt="portrait" className="player__icon-image" />
                </div>
                <div className="player__bank">
                Bank: {currPlayerObj.bank}
                </div>
            </div>
        </div>
        </>
    )
}