import React, { Fragment } from 'react';
import man from '../../../assets/images/dashboard/boy-2.png';
import { User, Mail, Lock, Settings, LogOut } from 'react-feather';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";

const UserMenu = () => {

    const dispatch = useDispatch();

    const logout = () => {
        console.log("!!!!!!!!!!!!in logout function");
        
        dispatch({
            type: 'SET_LOGIN_FLAG',
            flag: false
        });

    }

    return (
        <Fragment>
            <li className="onhover-dropdown">
                <div className="media align-items-center">
                    <img className="align-self-center pull-right img-50 rounded-circle blur-up lazyloaded" src={man} alt="header-user" />
                    <div className="dotted-animation">
                        <span className="animate-circle"></span>
                        <span className="main-circle"></span>
                    </div>
                </div>
                <ul className="profile-dropdown onhover-show-div p-20 profile-dropdown-hover">
                    {/* <li><a href="#javascript"><User />Edit Profile</a></li>
                    <li><a href="#javascript"><Mail />Inbox</a></li>
                    <li><a href="#javascript"><Lock />Lock Screen</a></li>
                    <li><a href="#javascript"><Settings />Settings</a></li> */}
                    {/* <li><a href={logout}><LogOut /> Log out</a></li> */}
                    <li onClick={logout}>
                        <Link to="/login">
                            <a href="#javascript"><LogOut /> Log out</a>
                        </Link>
                    </li>

                </ul>
            </li>
        </Fragment>
    );
};


export default UserMenu;