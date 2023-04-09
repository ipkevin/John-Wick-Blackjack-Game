import './Quit.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Quit({moves, playBtnClick}){
    const navigate = useNavigate();
    const [hideConfirm, setHideConfirm] = useState("quit__subcontainer--hide");

    function handleQuit(){
        playBtnClick();
        (hideConfirm === "") ? setHideConfirm("quit__subcontainer--hide") : setHideConfirm("");
    }
    function quitNow(){
        playBtnClick();
        moves.quit();
        navigate("/");
    }
    console.log("Quit component rerendering");
    return (
        <div className="quit__container">
            <button className={`move-button quit__button ${hideConfirm === "" && "quit__active-button"}`} onClick={handleQuit}>
                    Quit
            </button>
            <div className={`quit__subcontainer ${hideConfirm}`}>
                <p>Are you sure?</p>
                <button className="move-button" onClick={quitNow}>
                        Yes, quit
                </button>
                <button className="move-button" onClick={handleQuit}>
                        Cancel
                </button>
            </div>

        </div>
    )
}

