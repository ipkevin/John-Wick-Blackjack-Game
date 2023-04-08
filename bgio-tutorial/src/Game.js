import {INVALID_MOVE} from 'boardgame.io/core';
import { TurnOrder } from 'boardgame.io/core';


// function IsVictory(cells) {
    // So this will be passed the entire game 'board' (cells[])
    
    // positions are a set of 3 positions in the board that would be equal to a win
    // const positions = [
    //     [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    //     [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    // ];

    // const isRowComplete = row => {
    //     // So row passed in will actually set of 3 positions in 
    //     // the cells[] that would be needed to win (ie, from positions[] array)
    //     // This creates an array (symbols) that stores what playerID is stored in those 3 positions
    //     // If this array contains the same playerID in all 3 indices, that means a single player managed to get a winning row (got all 3 positions of winning configuration)
    //     const symbols = row.map(i => cells[i]);
    //     // Below checks whether every element in symbols is the same. This means a player got every spot in a winning config (ie, got a winning config)
    //     // returns True if so
    //     return symbols.every(i => i !== null && i === symbols[0]);
    // }
    // // .some just means as long as it's true once, return true
    // // cuz the first part returns an array where each index represents whether
    // // a winner was found for each of the winning configurations.  If any one is true, that means won (ie, was in a winning config)
    // return positions.map(isRowComplete).some(i => i === true);
// }


// The suits of cards
const suits = ["clubs", "spades", "hearts", "diamonds"];

// Represent cards. 1 = Ace, 11-13 = jack, queen, king
const ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13];

// returns an array of cards that will be shoe/deck games are played with
// numDecks = Number of decks to use (a typical blackjack deck incl 6-8 decks of cards)
// If numDecks is not provided or not a valid Int (int >= 1), then will set to 1
function buildDeck(numDecks = 1) {
    if (Number.isNaN(numDecks) || !Number.isInteger(numDecks) || numDecks < 1) {
        numDecks = 1;
    }
    let theDeck = []
    for (let d = 0; d < numDecks; d++) {
        for (let s = 0; s < suits.length; s++) {
            for (let r = 0; r < ranks.length; r++) {
                theDeck.push({
                    rank: ranks[r],
                    suit: suits[s]
                })
            }
        }
    }
    // console.log("here is the freshly built deck: ", theDeck);
    return theDeck;
}



// Returns an object containing all of the players represented as objects.  The key names are the players' playerID values.
// Doign it this way instead of a simple array because we don't know what bg.io does if players jump in/out. If a player leaves and another joins, does their playerID fill in the old one or start a new one?
// So we can't just use a simple array.  Instead, we use object where each key name equals the player's playerID. We know the ctx.playerOrder array contains the
// playerIDs as string values, so that's why use it to create the keys in the player object.
function initPlayers(ctx){
    let playersObj = {};
    for (let i=0; i< ctx.playOrder.length; i++){
        playersObj[ctx.playOrder[i]] = {
            hand: [],
            bank: 1000,
            bet: 0,
            busted: false,
            hasAces: false,
            hasBJ: false,
            handValue: 0,
            softAce: false, // has an Ace which can be changed to 1
            resultMessage: "",
            withdraws: 0,
        }
    }
    // console.log("this is the built up playersObj to be assigned to G.allPlayers: ", playersObj);
    return playersObj;
}

// Calculate value of player's hand. Returns value of hand.
// ALSO sets player's properties (busted, handValue, hasAces, softAce) accordingly. Does not set hasBJ as does not have context to determine it.
function getAndSetValue(playerObj) {
    
    /*****
     * might want to redo Dealer so that it's an object like player. Then can reuse this function more easily. Can still store separate card in secret.
     */
    
    let theHand = playerObj.hand;
    let hasAces = false;
    let softAce = false;
    let total = 0;
    for (let i=0; i<theHand.length; i++){
        let theCard = theHand[i];
        if (theCard.rank >= 2 && theCard.rank <= 10) {
            total += theCard.rank;
        } else if (theCard.rank >= 11 && theCard.rank <= 13) {
            total += 10;
        } else if (theCard.rank === 1){
            if (hasAces) {
                // player already has an Ace, so this can only be 1 (because 2x 11 would bust)
                total += 1;
            } else {
                hasAces = true;
                if (total >= 11) {
                    total += 1;
                    softAce = false;
                } else {
                    total += 11;
                    softAce = true;
                }
            }
        }
        if (total > 21 && softAce) {
            total -= 10;
            softAce = false;
        }
    }
    playerObj.handValue = total;
    playerObj.softAce = softAce;
    playerObj.hasAces = hasAces;
    if (playerObj.handValue > 21) playerObj.busted = true;
    return total;
}

function withdrawFromBank({G, ctx}){
    G.allPlayers[ctx.currentPlayer].withdraws += 1;
    G.allPlayers[ctx.currentPlayer].bank += 1000;
}

// // async function endPlayingTurn(G, playerID, events){
// function endPlayingTurn(G, playerID, events){
//     getAndSetValue(G.allPlayers[playerID]);
//     if (G.allPlayers[playerID].busted === true) {
//         G.turnsLeft -= 1;
//         // let g = await setTimeout(console.log("waiting"), 2000);
//         // setTimeout(console.log("waiting"), 2000);
//         console.log("right after timeout");
//         // events.endTurn();
//         console.log("right after endTurn");
//         setTimeout(events.endTurn(), 0);
//         return true;
//     }
//     return false;
// }
// function endIt(events) {
//     events.endTurn();
//     console.log("inside endIt()");
// }
// async function delayMe() {
//     setTimeout(console.log("delaying"), 2000);
//     return true;
// }

export const Blackjack = {
    setup: ({G, ctx}) => (
        {
            quit: null,
            gameSettings: {
                numDecks: 2,
                },
            deck: [],
            dealer: {
                hand: [],
                busted: false,
                hasAces: false,
                hasBJ: false,
                handValue: 0,
            },
            secret: {
                dealerCard: {},
            },
            turnsLeft: 0,
            allPlayers: initPlayers(ctx),
        }
    ),

    moves: {
        quitGame: ({G}) => {
            console.log("clicked quit!");
            
            // TO ADD: Remove player from the G.allPlayers object and kill that memory
            
            G.quit = true;
            console.log("value of G.quit in quitGame move: ", G.quit);

        },
    },

    phases: {
        betting: {
            onBegin: ({G, random, ctx}) => {
                
                // reset the deck and shuffle
                G.deck = random.Shuffle(buildDeck(G.gameSettings.numDecks));

                // Clear out the players' hands and bets and any round specific values
                for (const playa in G.allPlayers) {
                    G.allPlayers[playa].hand = [];
                    G.allPlayers[playa].bet = 0;
                    G.allPlayers[playa].busted = false;
                    G.allPlayers[playa].hasAces = false;
                    G.allPlayers[playa].hasBJ = false;
                    G.allPlayers[playa].handValue = 0;
                    G.allPlayers[playa].resultMessage = "";
                };

                G.dealer.hand = [];
                G.dealer.busted = false;
                G.dealer.hasAces = false;
                G.dealer.hasBJ = false;
                G.dealer.handValue = 0;
                G.secret.dealerCard = {};

                G.turnsLeft = ctx.numPlayers;
            },
            start: true,
            turn: {
                order: TurnOrder.RESET,
                minMoves: 1,
                maxMoves: 1,
                onEnd: ({G, events}) => {
                    if (G.turnsLeft < 1) {
                        events.endPhase();
                    }
                },
            },
            moves: {
                bet: ({G, playerID}, betAmt) => {
                    console.log("this is betAmt:",betAmt)
                    if (!betAmt || Number.isNaN(betAmt) || !Number.isInteger(betAmt) || betAmt < 1 || betAmt > G.allPlayers[playerID].bank) {
                        return INVALID_MOVE;
                    }
                    G.allPlayers[playerID].bet = betAmt;
                    G.allPlayers[playerID].bank -= betAmt;
                    G.turnsLeft -= 1;
                },
                getChips: {
                    move: withdrawFromBank,
                    noLimit: true, // required as this phase has 1 limit move limit normally
                },
            },
            
            next: 'playing',
        }, 

        playing: {
            onBegin: ({G, ctx}) => {
                
                
                // dealCards(G, ctx);
                // // deal first card to each player, then the dealer
                // for (let i=0; i<ctx.playOrder.length; i++){
                //     G.allPlayers[ctx.playOrder[i]].hand.push(G.deck.pop());
                // }
                for (const player in G.allPlayers) {
                    G.allPlayers[player].hand.push(G.deck.pop());
                }
                G.dealer.hand.push(G.deck.pop());
                
                // deal 2nd card to each player, then the dealer. Dealer's 2nd card is secret so that clients cannot see it.
                for (const player in G.allPlayers) {
                    G.allPlayers[player].hand.push(G.deck.pop());

                    // calculate value of player's hand now that it has both initial cards
                    if (getAndSetValue(G.allPlayers[player]) === 21) {
                        G.allPlayers[player].hasBJ = true;
                    }
                }
                G.secret.dealerCard = G.deck.pop(); // move 2nd card from secret area to dealer's publicly visible hand

                // Counter to determine how many turns left in this phase
                G.turnsLeft = ctx.numPlayers;
                
            },
            moves: {
                hit: ({G, playerID}) => {
                    // console.log("here are the cards left in the deck before hit: ", G.deck.length);
                    // console.log("here is playerID from hit move: ", playerID);
                    G.allPlayers[playerID].hand.push(G.deck.pop());
                    // console.log("here's the player's hand: ", JSON.stringify(G.allPlayers[playerID].hand));
                    // console.log("here are the cards left in the deck after hit: ", G.deck.length);
                },
                stand: ({G,events}) => {
                    G.turnsLeft -= 1;
                    events.endTurn();
                },
                endTurn: ({G, events}) => {
                    G.turnsLeft -= 1;
                    events.endTurn();
                },
                getChips: {withdrawFromBank},
            },
            turn: {
                order: TurnOrder.RESET,
                onBegin: ({G, ctx, events}) => {
                    // account for a player who got blackjack (21 on first 2 cards)
                    // ACTUALLY, can handle with button press on frontend (or automatic timeout press)
                    /********************
                     * 
                     * IF THIS WORKS, ERASE THIS WHOLE TURN.ONBEGIN AS NOT NECESSARY
                     * 
                     ************************/
                    if (G.allPlayers[ctx.currentPlayer].hasBJ) {
                        // G.turnsLeft -= 1;
                        //events.endTurn();  // Rely on user acknowledge or FE auto button press
                    }   
                },
                // If all players have done their moves, then end the phase:
                // TO ADD: Check the player hands, calculate dealer hands and determine winner
                onEnd: ({G, events}) => {
                    if (G.turnsLeft < 1) { events.endPhase()}
                },
                onMove: ({G, playerID, events}) => {
                    // Check the player's hand value and determine if can continue, or busted
                    // endPlayingTurn(G, playerID, events).then(result => {
                    //     // console.log("result of promise: ", result)
                    //     if (result === true) { 
                    //         console.log("true, so end turn");
                    //         events.endTurn();
                    //     } else {
                    //         console.log("not true");
                    //     }
                    // })
                    
                    // if (endPlayingTurn(G,playerID, events)) setTimeout(events.endTurn(), 3000);
                    // (endPlayingTurn(G,playerID, events));
                    getAndSetValue(G.allPlayers[playerID]);
                    if (G.allPlayers[playerID].busted === true) {
                        // NO LONGER USING THIS.  Cuz using endTurn here could not be delayed. If put in a promise then or
                        // in a setTimeout anon fxn, it fires but does nothing.
                        // SO instead will rely on a button press to move this forward.  In the button press, it
                        // will reduce turnsLeft and fire endthis event to end turn.

                        // G.turnsLeft -= 1;
                        // events.endTurn();
                    }
                },
            },
            next: 'dealingtodealer',
        },

        dealingtodealer: {
            onBegin: ({G,ctx,events}) => {
                /* 
                * Convert DealerHand to a Dealer object similar to player obj (so can use same functions)
                * Move the card into hand to reveal it.
                * Calculate the value.
                * If blackjack, set hasBJ, then move on to win/loss
                * If 17-20, stand and move to win/loss
                * If under 17, hit until reach at least 17 or bust
                * Calculate win/loss and payout.  Don't forget that if user busts then they lose even if dealer busted since user 
                * busts first.
                * Coudl setup a turn so that can easily access the currentPlayer. The only move is to continue on (& buy creds?)
                */
                G.dealer.hand.push(G.secret.dealerCard);
                G.secret.dealerCard = {}; 

                getAndSetValue(G.dealer);
                while (G.dealer.handValue <= 16) {
                    G.dealer.hand.push(G.deck.pop())
                    getAndSetValue(G.dealer);
                }
            },
            moves: {
                endDealerDealing: ({events}) => {
                    events.endPhase();
                },
                getChips: {withdrawFromBank},
            },
            next: "finishing",
        },
        finishing: {
            onBegin: ({G,ctx}) => {
                
                

                // Counter to determine how many turns left in this phase
                G.turnsLeft = ctx.numPlayers;
            },
            turn: {
                order: TurnOrder.RESET,
                onBegin: ({G,ctx}) => {
                    /* 
                    * Calculate and inform player if they won, lost, pushed
                    * (set player resultMessage after all of these)
                    * if busted, immed lose
                    * if BJ, then see if dealer also got BJ.  If not, get 3:2 payout (1.5 orig bet) + orig bet back (ie, 2.5x).
                    * if didn't bust, then see if higher than dealer value or if dealer busted.  If yes, then get 2x bet back.
                    * else, lose with msg that dealer got higher
                    * 
                    * ************************
                    * BUG BUG BUG FIX ME -- whenever 1st player gets any money back, they get it at win msg then AGAIN when bet phase starts
                    * See if maybe it's a turnorder thing? disable the betting phase reset on turn order.
                    * - Might be cuz Value calc is onBegin of turn, while end check is onMove (so end of prev), maybe the end is not fast enough
                    *  --> if so, then either add a check/flag (turnsleft?) to stop another calc for same user, or try endif to end the game.
                    **************************
                    */
                   if (G.turnsLeft !== 0) { // this check is required as there were async issues where this check onBegin check ran again before the end phase check finished from prev move

                       let currPlayer = G.allPlayers[ctx.currentPlayer];
                       if (currPlayer.busted === true) {
                           currPlayer.resultMessage = "Bust!";
                        } else if (currPlayer.hasBJ) { // player got BJ, but is it all it could be?
                            if (G.dealer.hasBJ) {
                                currPlayer.bank += currPlayer.bet;
                                currPlayer.resultMessage = `Push. Get your bet back: ${currPlayer.bet}`;
                            } else {
                                currPlayer.bank += 2.5*(currPlayer.bet);
                                currPlayer.resultMessage = `Blackjack Win! Payout 2.5x! ${2.5*currPlayer.bet}`;
                            }
                        } else { 
                            // player did not bust or get BJ, so figure out performance vs dealer
                            if (G.dealer.busted) {
                                currPlayer.bank += 2*(currPlayer.bet);
                                currPlayer.resultMessage = `Win! Payout 2x! ${2*currPlayer.bet}`;
                            } else if ((G.dealer.hasBJ && !currPlayer.hasBJ) || (G.dealer.handValue > currPlayer.handValue)) {
                                // 1st condition accounts for dealer having BJ while player has a non-BJ 21
                                currPlayer.resultMessage = "Lose. Try again!";
                            } else if (G.dealer.handValue === currPlayer.handValue) {
                                currPlayer.bank += currPlayer.bet;
                                currPlayer.resultMessage = `Push. Get your bet back: ${currPlayer.bet}`;
                            } else {
                                // if reach here, then player hand > dealer hand and no one busted
                                currPlayer.bank += 2*(currPlayer.bet);
                                currPlayer.resultMessage = `Win! Payout 2x! ${2*currPlayer.bet}`;
                            }
                        }
                    }
                },
                onMove: ({G, events}) => {
                    if (G.turnsLeft === 0) events.endPhase();
                },
            },
            moves: {
                // For the user to click to continue on once they have reviewed the results.
                OK: ({G,events}) => {
                    G.turnsLeft -= 1;
                    events.endTurn();
                },
                getChips: {
                    move: withdrawFromBank,
                },
            },
            next: "betting",
        }
    },


    
    endIf: ({G, ctx}) => {
        // if (IsVictory(G.cells)) {
        //     // You know it's the current player because this endIf check is run after every state change (ie, move).  So if it found winner then it must have occurred during currentPlayer's move
        //     console.log("endif isVict check ran");
        //     return { winner: ctx.currentPlayer};
        // }
        // if (IsDraw(G.cells)) {
        //     console.log("endif isdraw check ran");
        //     return { draw:true };
        // }
        if (G.quit === true) {
            alert("game over");
            console.log("endif quit check ran");
            // Must return something (even if it's "") in order for the game to actually end
            // NB: Game state does NOT actually reset!  But u can't keep playing either. So I guess u need to reset the game.
            return "you're a weiner";
        }
    }
}