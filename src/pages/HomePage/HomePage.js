// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import {useState, useEffect} from 'react';

import PlayButtons from '../../components/PlayButtons/PlayButtons';
import MusicPlayer from '../../components/MusicPlayer/MusicPlayer';
import fallbackImage from '../../assets/images/johnwickblackjack2.jpg';

import './HomePage.scss';

// import videoBG from '../../assets/videos/intro4red.mp4';
import videoBG from '../../assets/videos/intro.mp4';


export default function HomePage() {

    return (
        <>
        <div className="home__outer-wrapper">
            <div className="home__overlay"></div>
            {/* <video className="home__video" src={videoBG} autoPlay muted loop /> */}
            <video className="home__video" autoPlay muted loop poster={fallbackImage}>
                <source src={videoBG} type='video/mp4' />
                <img src={fallbackImage} alt="John Wick Blackjack game" title="Your browser does not support the <video> tag" />
            </video>

            <div className="home__content-wrapper">
                <nav>
                </nav>
                <main className="home__content">
                    <div className="home__title-group">
                        <h1 className="home__title">John Wick</h1>
                        <h2 className="home__subtitle">Blackjack</h2>
                    </div>
                    <PlayButtons />
                    <MusicPlayer />
                </main>
            </div>            
        </div>
        </>
    );
}