import GetHand from '../GetHand/GetHand';
import "./Dealer.scss";

export default function Dealer({dealerObj, ctx}) {
    return (
        <div className="dealer">
            <div className="dealer__cards">
                {ctx.phase === "dealingtodealer" || ctx.phase === "finishing" ? (
                    <>
                    <div className="player__score">
                        {/* Unlike players, we won't bother to show softAce reduced value if >= 17 since rule is dealer stands on all 17 */}
                        {dealerObj.handValue}{dealerObj.softAce && !dealerObj.hasBJ && dealerObj.handValue < 17 ? ` / ${dealerObj.handValue - 10}` : ""}
                    </div>
                    <p>
                        {/* Dealer cards: <br /> */}
                        {ctx.phase === "dealingtodealer" ? <GetHand playerObj={dealerObj} phase="dealingtodealer" /> : <GetHand playerObj={dealerObj} />}
                    </p>
                    </>
                ) : ( "" )}
                {ctx.phase === "playing" ? (
                    <p>
                        {/* Dealer cards:<br /> */}
                        <GetHand playerObj={dealerObj} mode="dealer" />
                    </p>
                ) : ( "" )}
            </div>
            <div className="dealer__value"></div>
        </div>
    );
}
