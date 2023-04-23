import {Link} from 'react-router-dom';
import './Disclaimer.scss';

export default function Disclaimer(){
    return (
        <div className="disclaimer">
            Coding, design, and art direction by Kevin Ip (<Link to="https://www.github.com/ipkevin" target="_blank">Link to my GitHub</Link>)
            <br />---<br />
            This is a non-profit app developed for a programming course. It is purely for educational, research & scholarship purposes. All rights and credit go directly to their rightful owners. No copyright infringement intended.
            
        </div>
    )
}