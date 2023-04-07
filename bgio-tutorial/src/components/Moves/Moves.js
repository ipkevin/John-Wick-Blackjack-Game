import useSound from 'use-sound';

import './Moves.scss';

import betSound from "../../assets/sounds/bet.ogg";
import takeCardSound from "../../assets/sounds/take_card.ogg";
import creditsSound from "../../assets/sounds/buy_credits.ogg";
import standSound from "../../assets/sounds/stand.ogg";
import btnSound from "../../assets/sounds/btn_click_quiet.ogg";


export default function Moves({currPlayerObj, moves, ctx}) {

    const [playBet] = useSound(betSound);
    const [playTakeCard] = useSound(takeCardSound);
    const [playBuyCredits] = useSound(creditsSound);
    const [playStand] = useSound(standSound);
    const [playBtnClick] = useSound(btnSound);

    function handleBet(num) {
        playBet();
        moves.bet(num);
    }
    function handleHit() {
        playTakeCard();
        moves.hit();
    }
    function handleStand() {
        playStand();
        moves.stand();
    }
    function handleOK() {
        playBtnClick();
        moves.OK();
    }
    function handleBuyCredits() {
        playBuyCredits();
        moves.getChips();
    }
    function handleEndTurn() {
        playBtnClick();
        moves.endTurn();
    }
    // Displays available moves for current phase
    const insertMoves = () => {
        if (ctx.phase === "betting") {
            return (
                <>
                    <button className="move-button" onClick={() => handleBet(100)}>
                        Bet 100
                    </button>
                    <button className="move-button" onClick={() => handleBet(500)}>
                        Bet 500
                    </button>
                    {currPlayerObj.bank < 500 ? <button className="move-button" onClick={handleBuyCredits}>Buy 1000 Chips</button> : "" }
                </>
            );
        } else if (ctx.phase === "playing" && currPlayerObj.busted === false && currPlayerObj.hasBJ === false) {
            return (
                <>
                    <button className="move-button" onClick={handleHit}>
                        Hit
                    </button>
                    <button className="move-button" onClick={handleStand}>
                        Stand
                    </button>
                </>
            );
        } else if (ctx.phase === "playing" && (currPlayerObj.busted === true || currPlayerObj.hasBJ === true)) {
            return (
                <>
                    <button className="move-button" onClick={handleEndTurn}>
                        OK
                    </button>
                </>
            );
        // } else if (ctx.phase === "dealingtodealer") {  // GOT RID OF THIS. USE AUTO END FROM AI
        //     return (
        //         <>
        //             <button className="move-button" onClick={handleEndDealerDealing}>
        //                 Continue
        //             </button>
        //         </>
        //     );
        } else if (ctx.phase === "finishing") {
            return (
                <>
                    <button className="move-button" onClick={handleOK}>
                        OK
                    </button>
                    <button className="move-button" onClick={handleBuyCredits}>
                        Buy 1000 Chips
                    </button>
                </>
            );
        }
    };

    return (
        <>
            <div className="move__container">
            {insertMoves()}
            </div>
        </>
    )
}