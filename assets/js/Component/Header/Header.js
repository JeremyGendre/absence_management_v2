import React, {useContext} from "react";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUserCircle, faSortDown, faPowerOff, faUser, faUserCog} from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import {redirectToLogout, SessionContext} from "../Context/session";

export default function Header(props){
    const user = useContext(SessionContext);

    function handleLogout(){
        user.updateUser(null);
        redirectToLogout();
    }

    let adminPage = '';
    if(user.isAdmin === true){
        adminPage = <li className="link-admin-view links-submenu-header"><Link to="/admin"><FontAwesomeIcon icon={faUserCog}/> <span className="link-profile-text">Admin</span></Link></li>;
    }
    return(
        <div id="header">
            <nav className="header-nav">
                <ul>
                    <li className="header-li">
                        <Link to="/">Accueil</Link>
                    </li>
                    <li className="header-li header-dropdown-links">
                        <Link to="/holidays/list">Congés</Link>
                        <div className="submenu header-submenu">
                            <ul>
                                <li className="links-submenu-header"><Link to="/holidays/list"><span>Mes congés</span></Link></li><hr className="submenu-hr"/>
                                <li className="links-submenu-header"><Link to="/holidays/new"><span>Faire une demande</span></Link></li>
                            </ul>
                        </div>
                    </li>
                    <li className="header-li header-dropdown-links">
                        <Link to="/calendar/personnal">Calendriers</Link>
                        <div className="submenu header-submenu">
                            <ul>
                                <li className="links-submenu-header"><Link to="/calendar/personnal"><span>Mon calendrier</span></Link></li><hr className="submenu-hr"/>
                                <li className="links-submenu-header"><Link to="/calendar/service"><span>Service</span></Link></li><hr className="submenu-hr"/>
                                <li className="links-submenu-header"><Link to="/calendar/colleagues"><span>Collègues</span></Link></li><hr className="submenu-hr"/>
                                <li className="links-submenu-header"><Link to="/calendar/tabular"><span>Tabulaire</span></Link></li>
                            </ul>
                        </div>
                    </li>
                    <li className="link-profile header-li header-dropdown-links">
                            <span className="link-profile-a">
                                <span className="profile-name link-profile-text">{user.user.last_name + ' '+user.user.first_name}</span>
                                <FontAwesomeIcon icon={faUserCircle} size="lg"/>
                                <FontAwesomeIcon icon={faSortDown} size="xs" className="link-profile-arrow dropdown-arrows"/>
                            </span>
                        <div className='submenu link-profile-submenu header-submenu'>
                            <ul>
                                <li className="link-profile-view links-submenu-header"><Link to="/profile"><FontAwesomeIcon icon={faUser}/> <span className="link-profile-text">Profil</span></Link></li>
                                {adminPage}
                                <li onClick={handleLogout}><FontAwesomeIcon icon={faPowerOff}/> <span className="link-profile-text">Deconnexion</span></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
