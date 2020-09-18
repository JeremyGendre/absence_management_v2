import React, {useEffect, useState} from "react";
import {isBadResult} from "../../utils/server";
import axios from 'axios';
import {Redirect} from "react-router-dom";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const sessionDefaultValues = {
    user: null,
    isAdmin: false,
};

export const SessionContext = React.createContext(sessionDefaultValues);

export function userHasRole(user,role){
    if(user === null || user.roles === undefined || Array.isArray(user.roles) === false){
        return false;
    }
    return user.roles.includes(role);
}

export function redirectToLogout(){
    window.location.href = document.getElementById('logout-url').getAttribute('data-href');
}

export default function ApplicationSession(props){
    let userInfos = null;
    try{
        userInfos = JSON.parse(document.getElementById('user').getAttribute('data-user'));
        console.log(userInfos);
    }catch(error){
        logout();
    }
    const [user, setUser] = useState({
        user: userInfos,
        isAdmin: userHasRole(userInfos,'ROLE_ADMIN'),
        updateUser: updateUserState
    });

    function logout(){
        MySwal.fire({
            icon:'error',
            title:'Vous avez été déconnecté'
        }).then(()=> {
            updateUserState(null);
            redirectToLogout();
        });
    }

    function updateUserState(userData) {
        setUser({
            ...user,
            user: userData,
            isAdmin: userHasRole(userData,"ROLE_ADMIN")
        });
    }

    return (
        <SessionContext.Provider
            value={user}
        >
            {props.children}
        </SessionContext.Provider>
    );
}
