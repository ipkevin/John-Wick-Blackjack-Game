
import './Moves.scss';

export default function Moves({currPlayerObj, moves, ctx}) {
    function handleBet(num) {
        moves.bet(num);
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
    // function handleEndDealerDealing() {
    //     moves.endDealerDealing();
    // }
    function handleEndTurn() {
        console.log("current player about to be removed: ", ctx.currentPlayer);
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
            console.log("in the insertMoves fxn, playing and busted/blackjack");
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