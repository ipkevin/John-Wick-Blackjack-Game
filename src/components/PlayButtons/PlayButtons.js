import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import useSound from 'use-sound';

import btnSound from "../../assets/sounds/btn_click_quiet.ogg";

import "./PlayButtons.scss";


export default function PlayButton() {

    const navigate = useNavigate();
    
    const [playBtnClick] = useSound(btnSound);

    const [hideLocalOptions, setHideLocalOptions] = useState("buttons__group--hidden");

    function toggleLocalOptions(){
        playBtnClick();
        (hideLocalOptions === "") ? setHideLocalOptions("buttons__group--hidden") : setHideLocalOptions("");
    }
    function startGame(num){
        playBtnClick();
        navigate(`/game/${num}`);
    }

    return (
        <div className="buttons">

            <div className="buttons__group">
                <button className={`std-btn ${hideLocalOptions === "" && "std-btn--active"} homebuttons-local`} onClick={toggleLocalOptions}>Play Local Game</button>
                <button className="std-btn std-btn--disabled coming-soon homebuttons-multiplayer" disabled>Play Multiplayer Game<div className="coming-soon__message">Coming Soon</div></button>
            </div>
            <div className={`buttons__group ${hideLocalOptions}`}>
                <p>Select # of Players:</p>
                <div className="homebuttons__numplayers-box">
                    <button className="std-btn" onClick={() => startGame(1)}>1</button>
                    <button className="std-btn" onClick={() => startGame(2)}>2</button>
                    <button className="std-btn" onClick={() => startGame(3)}>3</button>
                </div>
            </div>
            
        </div>
    )
}