import { v4 as uuid } from 'uuid';
import cardImages from '../../utils/CardImages';
import './PlayerHand.scss';

    // Hash table to quickly lookup name of card
    const cardNames = {
        "1": "ace",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
        "11": "jack",
        "12": "queen",
        "13": "king"
    };

    // Returns an array of the names and suits of the cards in the player's hand
    function displayCards(thePlayer, phase){

        // let hands = [];
        // hands = thePlayer.hand.map((card) => {
        //     let value = `${card.suit}_${cardNames[card.rank].toLowerCase()}`; // cardNames[card.rank]+" of "+card.suit;
        //     // console.log("here is the name of the card from displayCards(): ", value);
        //     // return value;
        // });
        // return hands;

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
    // <p>Your cards: {displayCards(playerObj).map(element => 
    //     (<img className="card" src={cardImages[element]} alt={`${element} card`} key={uuid()} />)
    //     )}
    // </p>
    return (
    <>
    {displayCards(playerObj, phase)}
    {/* {displayCards(playerObj).map((element, index, arr) => (
        <img 
        className={`card ${(arr.length <= 2) ? "card--animated" : ""}`} 
        src={cardImages[element]} 
        alt={`${element} card`} key={uuid()} />
    ))} */}

    </>
    )
}

   /* <p>Your cards: {displayCards(playerObj).map((element, index, arr) => 
        (<img className={`card ${(arr.length <= 2) ? "card--animated" : ""}`} src={cardImages[element]} alt={`${element} card`} key={uuid()} />)
        )}
    </p> */