import {useState} from 'react';
import './Fan.scss';

import useSound from 'use-sound';
import btnSound from "../../assets/sounds/btn_click_quiet.ogg";
import fanIconOn from "../../assets/images/fanicon-on.png";
import fanIconOff from "../../assets/images/fanicon-off.png";


export default function Fan(){
    const [fanStatus, setFanStatus] = useState("");
    const [playBtnClick] = useSound(btnSound);

    // useEffect(() => {
    //     if (fanStatus === ""){
    //         fanBtnRef.current.innerHTML = fanImgOn;
    //     } else {
    //         fanBtnRef.current.innerHMTL = fanImgOff;
    //     }
    // }, [])
        
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
                <button className="std-btn fan__button" onClick={toggleFan}><img className="fan__button-image" src={(fanStatus === "") ? fanIconOn : fanIconOff} alt="fan on" /></button>
            </div>
        </>
    );
}