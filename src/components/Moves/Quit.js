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
    
    return (
        <div className="quit__container">
            <button className={`std-btn std-btn-secondary quit__button ${hideConfirm === "" && "std-btn--active"}`} onClick={handleQuit}>
                    Quit
            </button>
            <div className={`quit__subcontainer ${hideConfirm}`}>
                <p>Are you sure?</p>
                <button className="std-btn" onClick={quitNow}>
                        Yes, quit
                </button>
                <button className="std-btn" onClick={handleQuit}>
                        Cancel
                </button>
            </div>

        </div>
    )
}

