import {useState, useRef} from 'react';
import './Fan.scss';

import useSound from 'use-sound';
import btnSound from "../../assets/sounds/btn_click_quiet.ogg";
import fanIconOn from "../../assets/images/fanicon-on.png";
import fanIconOff from "../../assets/images/fanicon-off.png";


export default function Fan(){
    const [fanStatus, setFanStatus] = useState("");
    const [playBtnClick] = useSound(btnSound);

    const fanBtnRef = useRef();
    const fanImgOn = `<img class="fan__button-image" src=${fanIconOn} alt="fan on" />`;
    const fanImgOff = `<img class="fan__button-image" src=${fanIconOff} alt="fan off" />`;


    // useEffect(() => {
    //     if (fanStatus === ""){
    //         fanBtnRef.current.innerHTML = fanImgOn;
    //     } else {
    //         fanBtnRef.current.innerHMTL = fanImgOff;
    //     }
    // }, [])
        
    

    function toggleFan(e){
        playBtnClick();
        console.log(fanBtnRef);
        if (fanStatus === ""){
            setFanStatus("fan--stopped");
            fanBtnRef.current.innerHTML = fanImgOff;
        } else {
            setFanStatus("");
            fanBtnRef.current.innerHTML = fanImgOn;
        }
        console.log("fanstatus is ", fanStatus);
    }
    
    return (
        <>
        
            <div className={`fan ${fanStatus}`}>
                <div className="fan__blade fan__blade-vert"></div>
                <div className="fan__blade fan__blade-cross"></div>
            </div>
            <div className="fan__control">
                <button className="std-btn fan__button" onClick={toggleFan} ref={fanBtnRef}><img className="fan__button-image" src={fanIconOn} alt="fan on" /></button>
            </div>
        </>
    );
}