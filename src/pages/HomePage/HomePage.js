import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';

import './HomePage.scss';

import videoBG from '../../assets/videos/intro.m4v';
import songBG from '../../assets/sounds/lecastlevania_ledspirals.mp3';

export default function HomePage() {
    const navigate = useNavigate();

    const [buttonSet, setButtonSet] = useState("");

    function startGame(){
        navigate("/game");
    }

    return (
        <div className="home__outer-wrapper">
            <div className="home__overlay"></div>
            <video className="home__video" src={videoBG} autoPlay muted loop />
            <div className="home__content-wrapper">
                <nav>
                </nav>
                <main className="home__content">
                    <div className="home__title-group">
                        <h1 className="home__title">John Wick</h1>
                        <h2 className="home__subtitle">Blackjack</h2>
                    </div>
                    <div className="home__button-group">
                        <button className="home__buttons" onClick={startGame}>Play Local Game</button>
                        <button className="home__buttons">Play Multiplayer Game</button>
                        <audio className="home__music-player" src={songBG} autoPlay loop controls preload="auto"></audio>
                    </div>
                    
                </main>
                
            </div>
        </div>
    );
}