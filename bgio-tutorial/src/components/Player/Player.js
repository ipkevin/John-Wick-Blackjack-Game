import {useRef} from 'react';
import useSound from 'use-sound';

import GetHand from '../GetHand/GetHand';
// import {v4 as uuid} from 'uuid';
import "./Player.scss";

import johnWick1 from '../../assets/images/portraits/johnwick.jpg';
import donnie1 from '../../assets/images/portraits/donnie.jpg';
import ballerina1 from '../../assets/images/portraits/ballerina.jpg';

import glockicon from '../../assets/images/glockicon-edit.png';
import skull2 from '../../assets/images/skull2.png';

import coinSmallSound from "../../assets/sounds/coin_small.ogg"; 
import coinBigSound from "../../assets/sounds/coin_big.ogg";
import coinMediumSound from "../../assets/sounds/coin_medium.ogg";
import clapBigSound from "../../assets/sounds/clap_big.ogg";
import loseSound from "../../assets/sounds/lose_quiet.ogg";
import ledSpiralsClip from "../../assets/sounds/led_spirals_clip.mp3";

/******************
 * 
 * ERROR: The cards for all players do the sweep in animation even when it's another player getting cards
 * Try to fix why that is.  Differences are that 1) I now show all hands on the screen instead of just current player's, and 
 * 2) I used to pass a currPlayerObj to Player that actually used the ctx.currentPlayer to determine. Now i pass a currPlayerObj that is actually
 * tied to a specific player
 * 
 */

export default function Player({currPlayerObj, ctx, index, theDealer}){

    const [playCoinBig] = useSound(coinBigSound);
    const [playCoinMedium] = useSound(coinMediumSound);
    const [playClapBig] = useSound(clapBigSound);
    const [playCoinSmall] = useSound(coinSmallSound);
    const [playLose] = useSound(loseSound);
    const [playLedSpirals] = useSound(ledSpiralsClip);
    
    // Determines which image will be used for player avatar depending on player order (0-2)
    let portraitImage;
    if (index === 1){
        portraitImage = donnie1;
    } else if (index === 2){
        portraitImage = ballerina1;
    } else {
        portraitImage = johnWick1;
    }

    // Affects player avatar's border effect if busted/blackjack by changing a class name
    let iconBorder = "";
    if (currPlayerObj.busted) {
        iconBorder = "player__icon-image--bust";
    } else if (currPlayerObj.hasBJ) {
        iconBorder = "player__icon-image--blackjack";
    }

    // Plays the coin & other sounds when announce win
    function playSound(mode) {
        // These 2 conditions ensure effect only plays once during start of this player's turn
        if (ctx.currentPlayer === index.toString() && ctx.numMoves === 0) {
            if (mode === "bjwin") {
                playLedSpirals();
                playCoinBig();
                playClapBig();
                setTimeout(() => playCoinMedium(), 300);
            } else if (mode === "win") {
                playLedSpirals();
                playCoinBig();
                setTimeout(() => playCoinMedium(), 300);
            } else if (mode === "push") {
                playCoinSmall();
            } else if (mode === "lose") {
                playLose();
            }
        }
    }

    return (

     
        <div className={`player 
            ${(index === 0) ? "player__pos0" : ""}
            ${(index === 1) ? "player__pos1" : ""}
            ${(index === 2) ? "player__pos2" : ""}
            ${(ctx.currentPlayer === index.toString() && ctx.phase !== "dealingtodealer") ? "player--highlighted" : ""}
        `}>

            {/* Shows the result title (win, lose, push) above the player */}
            {ctx.phase === "finishing" && currPlayerObj.resultMessage.includes("Win") 
                ? <>{(currPlayerObj.hasBJ) ? playSound("bjwin") : playSound("win")}<h3 className="player__result player__result--win">Winner</h3><p className="player__result-details">Result: {currPlayerObj.resultMessage}</p></> 
                : ""}
            {ctx.phase === "finishing" && (currPlayerObj.resultMessage.includes("Lose") || currPlayerObj.resultMessage.includes("Bust")) 
                ? <>{playSound("lose")}<h3 className="player__result player__result--lose">Lose</h3><p className="player__result-details">Result: {currPlayerObj.resultMessage}</p></> 
                : ""}
            {ctx.phase === "finishing" && currPlayerObj.resultMessage.includes("Push") 
                ? <>{playSound("push")}<h3 className="player__result player__result--push">Push</h3><p className="player__result-details">Result: {currPlayerObj.resultMessage}</p></> 
                : ""}
            {/* {ctx.phase === "finishing" ? <p>Result: {currPlayerObj.resultMessage}</p> : ""} */}
            {/* FINAL SCORE VS DEALER */}
            {/* {ctx.phase === "finishing" ? (
                <p>
                    Dealer total: {theDealer.handValue} {theDealer.hasBJ ? "(blackjack)" : ""} Your total: {currPlayerObj.handValue} {currPlayerObj.hasBJ ? "(blackjack)" : ""}
                </p>
            ) : ( "" )} */}

            {/* Show the BlackJack/Bust status message above the cards */}
            <div className="player__status">
                {currPlayerObj.busted === true ? <p className="player__status-text"><img src={skull2} className="player__status-icon player__status-icon--skull" alt="" />&nbsp;BUST &nbsp;<img src={skull2} className="player__status-icon  player__status-icon--skull" alt="" /></p> : ""}
                {currPlayerObj.hasBJ === true ? <p className="player__status-text player__status-text--blackjack"><img src={glockicon} className="player__status-icon player__status-icon--reversed" alt="" />BLACKJACK <img src={glockicon} className="player__status-icon" alt="" /></p> : ""}
            </div>
      
            {/* Show the player's cards and value/score of hand */}
            <div className="player__cards">
                {ctx.phase === "finishing" || ctx.phase === "playing" || ctx.phase === "dealingtodealer" 
                ? 
                <div className="player__score">
                    {currPlayerObj.handValue}{currPlayerObj.softAce && !currPlayerObj.hasBJ ? ` / ${currPlayerObj.handValue - 10}` : ""}
                </div>
                : "" }
                {ctx.phase === "finishing" || ctx.phase === "dealingtodealer" ? (
                    <p>
                    <GetHand playerObj={currPlayerObj} />
                    </p>
                ) : "" }
                {ctx.phase === "playing" ? (
                    <p>
                    <GetHand playerObj={currPlayerObj} phase={ctx.currentPlayer === index.toString() ? "playing" : ""} />
                    </p>
                ) : (
                    ""
                )}
            </div>
            <div className="player__info-box">
                <div className="player__bet">
                Bet ${currPlayerObj.bet}
                </div>
                <div className="player__icon">
                    <img src={portraitImage} alt="portrait" className={`player__icon-image ${iconBorder}`} />
                </div>
                <div className="player__bank">
                Bank ${currPlayerObj.bank}
                </div>
            </div>
        </div>

    )
}