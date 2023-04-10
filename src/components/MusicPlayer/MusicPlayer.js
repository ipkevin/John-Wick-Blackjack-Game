import './MusicPlayer.scss';
import songBG from '../../assets/sounds/lecastlevania_ledspirals2.mp3';
import audioOff from '../../assets/images/audio-icon-cross2.png';
import audioOn from '../../assets/images/audio-icon-on.png';
export default function MusicPlayer(){

    return (
        <>
            {/* <img className="audio-icon std-btn" src={onPlaying && audioOn} alt="audio on off" /> */}
            <audio className="home__music-player" src={songBG} autoPlay onPlay={(e) => {e.target.volume=0.15}} loop controls preload="auto"></audio>
        </>
    )
}