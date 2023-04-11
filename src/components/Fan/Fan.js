import {useState} from 'react';
import './Fan.scss';

export default function Fan(){
    const [fanStatus, setFanStatus] = useState("");

    function toggleFan(){
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