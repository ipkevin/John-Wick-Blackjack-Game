import useSound from 'use-sound';

import GetHand from '../GetHand/GetHand';
// import {v4 as uuid} from 'uuid';
import "./Player.scss";

// Media asset imports
import johnWick1 from '../../assets/images/portraits/johnwick.jpg';
import donnie1 from '../../assets/images/portraits/donnie.jpg';
import ballerina1 from '../../assets/images/portraits/ballerina.jpg';

import glockicon from '../../assets/images/glockicon-edit.png';
import skull from '../../assets/images/skull.png';

import coinSmallSound from "../../assets/sounds/coin_small.ogg"; 
import coinBigSound from "../../assets/sounds/coin_big.ogg";
import coinMediumSound from "../../assets/sounds/coin_medium.ogg";
import clapBigSound from "../../assets/sounds/clap_big.ogg";
import loseSound from "../../assets/sounds/lose_quiet.ogg";
import ledSpiralsClip from "../../assets/sounds/led_spirals_clip.mp3";
import maybeimwrongClip from "../../assets/sounds/maybeimwrong.mp3";
import maybenotClip from "../../assets/sounds/maybenot.mp3";
import yeahNotReallyClip from "../../assets/sounds/yeahnotreally.mp3"


export default function Player({currPlayerObj, ctx, index, theDealer}){

    const [playCoinBig] = useSound(coinBigSound);
    const [playCoinMedium] = useSound(coinMediumSound);
    const [playClapBig] = useSound(clapBigSound);
    const [playCoinSmall] = useSound(coinSmallSound);
    const [playLose] = useSound(loseSound);
    const [playLedSpirals] = useSound(ledSpiralsClip);
    const [playMaybeImWrong] = useSound(maybeimwrongClip);
    const [playMaybeNot] = useSound(maybenotClip);
    const [playYeahNotReally] = useSound(yeahNotReallyClip);
    
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
                if (ctx.currentPlayer.hasBJ) {
                    playYeahNotReally(); 
                }
            } else if (mode === "lose") {
                playLose();
                if (ctx.currentPlayer.hasBJ) {
                    playYeahNotReally();
                } else {
                    if (Math.random() > 0.5) {
                        playMaybeNot(); 
                        console.log('inmaybwrong')
                    }
                }
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
                ? <>{(currPlayerObj.hasBJ) ? playSound("bjwin") : playSound("win")}<h3 className="player__result player__result--win">Winner</h3></> 
                : ""}
            {ctx.phase === "finishing" && (currPlayerObj.resultMessage.includes("Lose") || currPlayerObj.resultMessage.includes("Bust")) 
                ? <>{playSound("lose")}<h3 className="player__result player__result--lose">Lose</h3></> 
                : ""}
            {ctx.phase === "finishing" && currPlayerObj.resultMessage.includes("Push") 
                ? <>{playSound("push")}<h3 className="player__result player__result--push">Push</h3></> 
                : ""}

            {/* Show the BlackJack/Bust status message above the cards */}
            <div className="player__status">
                {currPlayerObj.busted === true ? <p className="player__status-text"><img src={skull} className="player__status-icon player__status-icon--skull player__status-icon--skull--reversed" alt="" /> BUST&nbsp;<img src={skull} className="player__status-icon  player__status-icon--skull" alt="" /></p> : ""}
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