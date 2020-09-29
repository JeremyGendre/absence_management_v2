import React, {useEffect, useState} from "react";
import {isBadResult} from "../../utils/server";
import axios from 'axios';
import {Redirect} from "react-router-dom";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {userHasRole, userIsAdmin} from "../../utils/user";

const MySwal = withReactContent(Swal);

const sessionDefaultValues = {
    user: null,
    isAdmin: false,
};

export const SessionContext = React.createContext(sessionDefaultValues);

export function redirectToLogout(){
    window.location.href = document.getElementById('logout-url').getAttribute('data-href');
}

export default function ApplicationSession(props){
    let userInfos = null;

    const [user, setUser] = useState({
        user: userInfos,
        isAdmin: userIsAdmin(userInfos),
        updateUser: updateUserState
    });

    useEffect(()=>{
        axios.get('/api/user/auth').then((data)=>{
            let messageResult = isBadResult(data);
            if(messageResult !== ''){
                logout();
            }else{
                updateUserState(data.data);
            }
        }).catch((error)=>{
            console.error(error);
            logout();
        });
    },[]);

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
            user: userData,
            isAdmin: userIsAdmin(userData),
            updateUser: updateUserState
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
