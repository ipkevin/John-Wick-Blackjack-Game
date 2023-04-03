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
const suits = ["Clubs", "Spades", "Hearts", "Diamonds"];

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
            // console.log("inside the softace remover, softace before remove:", softAce);
            softAce = false;
            // console.log("inside the softace remover, softace after remove:", softAce);
        }
    }
    // console.log("handvalue just before getting assigned from total:", playerObj.handValue);
    // console.log('total just before assign to handvalue:',total);
    playerObj.handValue = total;
    playerObj.softAce = softAce;
    playerObj.hasAces = hasAces;
    // console.log("handvalue just after getting assigned from total:", playerObj.handValue);
    if (playerObj.handValue > 21) playerObj.busted = true;
    return total;
}

export const Blackjack = {
    setup: ({G, ctx}) => (
        {
            quit: null,
            gameSettings: {
                numDecks: 2,
                },
            deck: [],
            dealerHand: [],
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

        }
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
                }
                G.dealerHand = [];
                G.secret.dealerCard = {};
                G.turnsLeft = ctx.numPlayers;
            },
            start: true,
            turn: {
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
                }
            },
            
            next: 'playing',
        }, 

        playing: {
            onBegin: ({G, ctx}) => {
                
                // // deal first card to each player, then the dealer
                // for (let i=0; i<ctx.playOrder.length; i++){
                //     G.allPlayers[ctx.playOrder[i]].hand.push(G.deck.pop());
                // }
                for (const player in G.allPlayers) {
                    G.allPlayers[player].hand.push(G.deck.pop());
                }
                G.dealerHand.push(G.deck.pop());

                // // deal 2nd card to each player, then the dealer. Dealer's 2nd card is secret so that clients cannot see it.
                // for (let i=0; i<ctx.playOrder.length; i++){
                //     G.allPlayers[ctx.playOrder[i]].hand.push(G.deck.pop());
                // }
                for (const player in G.allPlayers) {
                    G.allPlayers[player].hand.push(G.deck.pop());

                    // calculate value of player's hand now that it has both initial cards
                    if (getAndSetValue(G.allPlayers[player]) === 21) {
                        G.allPlayers[player].hasBJ = true;
                        alert("natural blackjack for this player: ", player)
                    }
                }
                G.secret.dealerCard = G.deck.pop();

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
            },
            turn: {
                order: TurnOrder.RESET,
                onBegin: ({G, ctx, events}) => {
                    // account for a player who got blackjack (21 on first 2 cards)
                    if (G.allPlayers[ctx.currentPlayer].hasBJ) {
                        G.turnsLeft -= 1;
                        events.endTurn();
                    }   
                },
                // If all players have done their moves, then end the phase:
                // TO ADD: Check the player hands, calculate dealer hands and determine winner
                onEnd: ({G, events}) => {
                    if (G.turnsLeft < 1) { events.endPhase()}
                },
                onMove: ({G, playerID, events}) => {
                    // Check the player's hand value and determine if can continue, or busted
                    getAndSetValue(G.allPlayers[playerID]);
                    if (G.allPlayers[playerID].busted === true) {
                        G.turnsLeft -= 1;
                        events.endTurn();
                    }
                },
            },
            next: 'betting',
        },
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