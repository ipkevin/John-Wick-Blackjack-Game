import GetHand from '../GetHand/GetHand';
import "./Dealer.scss";

export default function Dealer({dealerObj, ctx}) {
    return (
        <div className="dealer">
            <div className="dealer__cards">
                {ctx.phase === "dealingtodealer" || ctx.phase === "finishing" ? (
                    <p>
                        {/* Dealer cards: <br /> */}
                        {ctx.phase === "dealingtodealer" ? <GetHand playerObj={dealerObj} phase="dealingtodealer" /> : <GetHand playerObj={dealerObj} />}
                    </p>
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
