
import { useParams } from 'react-router-dom';

import { Client } from 'boardgame.io/react';
import {Blackjack} from '../../Game';
import {BlackjackBoard} from '../../components/Board/Board';

import './PlayPage.scss';

export default function PlayPage() {

    const {numPlayers} = useParams();
    // let currLocation = useLocation();

    let theNum = null;
    switch (numPlayers) {
        case "1":
            theNum = 1;
            break;
        case "2": 
            theNum = 2;
            break;
        case "3":
            theNum = 3;
            break;
        default:
            theNum = 1;
    }
    const Game = Client({game: Blackjack, board: BlackjackBoard, debug: false, numPlayers: theNum});
    // The actual component where the game UI takes place is Board.js but it's displayed by the Client component (Game) below
    return (
        <>
           <Game />
        </>
    );
}