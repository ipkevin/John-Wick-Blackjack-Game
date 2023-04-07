import { v4 as uuid } from 'uuid';
import {cardImages} from '../../constants/CardImages';
import './GetHand.scss';
import {cardNames} from '../../constants/CardNames';
    
export default function GetHand({playerObj, phase, mode}){

    let hands = playerObj.hand.map((card, index, arr) => {
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
            animateClass = "card--animated-slower";
        }
        return (
            <img src={cardImages[`${card.suit}_${cardNames[card.rank].toLowerCase()}`]} 
            className={`card ${animateClass}`} 
            alt={`${card.rank} of ${card.suit} card`} 
            key={uuid()} />
        )
    })
    return (
        <>{hands}</>
    )
}