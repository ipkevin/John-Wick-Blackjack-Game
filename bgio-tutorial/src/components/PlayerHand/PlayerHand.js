import { v4 as uuid } from 'uuid';
import cardImages from '../../utils/CardImages';
import './PlayerHand.scss';
import cardNames from '../../utils/CardNames';

    // Returns an array of the names and suits of the cards in the player's hand
    function displayCards(thePlayer, phase){

        let hands = thePlayer.hand.map((card, index, arr) => {
            let animateClass = "";
            // This sets the animation class on the cards. Logic ensures only "newly dealt to hand" cards are animated
            if (phase === "playing") {
                if (arr.length <= 2) {
                    if (index === 1) {
                        animateClass = "card--animated-slower";
                    } else {
                        animateClass = "card--animated";
                    }
                } else { // so past the first 2 cards. We only animate the final 'new' card now
                    if (index === arr.length - 1) animateClass = "card--animated"
                }
            }
            if (phase === "dealingtodealer" && arr.length > 1 && index === arr.length-1) {
                console.log("in dealingtodealer class setting condition");
                animateClass = "card--animated-slower";
            }
            // if (phase === "playing" && (arr.length <= 2 || (arr.length > 2 && index === arr.length - 1)) ) {
            //     animateClass = "card--animated";
            // }
            return (
                <img src={cardImages[`${card.suit}_${cardNames[card.rank].toLowerCase()}`]} 
                className={`card ${animateClass}`} 
                key={uuid()} />
            )
        })
        return hands;
    }
    
export default function PlayerHand({playerObj, phase}){

    return (
    <>
    {displayCards(playerObj, phase)}

    </>
    )
}