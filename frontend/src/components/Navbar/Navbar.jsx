import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

export default function Navbar(props){
    const { loggedIn, handleLogout, newNotif } = props;
    return (

    <div className="header">
        <nav className="navbar bg-dark navbar-expand">
            <Link className="navbar-brand text-white cursive" to="/"> Restify </Link>
            <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto w-100">
                <li className="nav-item">
                <Link className="nav-link text-white" to="/search"><p className="text-click">Search</p></Link>
                </li>
                {loggedIn && (
                    <li className="nav-item">
                    <Link className="nav-link text-white" to="/reservations"><p className="text-click">Reservations</p></Link>
                    </li>
                )}
                {/* {loggedIn && (
                    <li className="nav-item">
                    <Link className="nav-link text-white" to="/reviews"><p className="text-click">Reviews</p></Link>
                    </li>
                )} */}
                
                {loggedIn && (
                    <li className="nav-item">
                    <Link className="nav-link text-white" to="/properties"><p className="text-click">List New Property</p></Link>
                    </li>
                )}
                
            </ul>
            </div>
            {!loggedIn && (
                <>
            <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto mr-0">
            <li className="nav-item">
                <Link className="nav-link text-white" to="/signup"><p className="text-click">Sign Up</p></Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link text-white" to="/login"><p className="text-click">Login</p></Link>
            </li>
            </ul>
            </div>
            </>)}

            {loggedIn && ( 
                <>
                <div className="collapse navbar-collapse">
                <ul className="navbar-nav ml-auto mr-0">
                    
                    <li className="nav-item ">
                        <Link className="nav-link text-white"  to="/profile">
                            
                            <p className=" text-click"> Profile <FontAwesomeIcon icon={faUser} /> </p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" onClick={handleLogout}><p className="text-click">Logout</p></Link>
                    </li>
                    <li>
                        <Link className={`nav-link ${newNotif? "text-danger" : "text-white"}`}  to="/notifications">
                            <FontAwesomeIcon className="text-click " icon={faBell}/>
                        </Link>
                   
                    </li>
                </ul>
                </div>
                </>
            )}
        </nav>
    </div>
          
  );
}
