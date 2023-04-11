import {useState} from 'react';
import useSound from 'use-sound';
import btnSound from "../../assets/sounds/btn_click_quiet.ogg";

import './Fan.scss';

export default function Fan(){
    const [fanStatus, setFanStatus] = useState("");
    const [playBtnClick] = useSound(btnSound);

    function toggleFan(){
        playBtnClick();
        if (fanStatus === ""){
            setFanStatus("fan--stopped");
        } else {
            setFanStatus("");
        }
    }
    
    return (
        <>
            <div className={`fan ${fanStatus}`}>
                <div className="fan__blade fan__blade-vert"></div>
                <div className="fan__blade fan__blade-cross"></div>
            </div>
            <div className="fan__control">
                <button className="std-btn fan__button" onClick={toggleFan}>Toggle Fan</button>
            </div>
        </>
    );
}