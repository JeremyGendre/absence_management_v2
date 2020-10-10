import React, {useEffect, useState} from "react";
import axios from 'axios';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {userIsAdmin} from "../../utils/user";

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
    const userInfos = null;

    const [user, setUser] = useState({
        user: userInfos,
        isAdmin: userIsAdmin(userInfos)
    });

    useEffect(()=>{
        axios.get('/api/user/auth').then((result)=>{
            updateUserState(result.data);
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
        if(userData !== null && userData.isActive !== undefined && userData.isActive === false){
            logout();
        }
        setUser({
            user: userData,
            isAdmin: userIsAdmin(userData)
        });
    }

    return (
        <SessionContext.Provider value={{...user , updateUser: updateUserState}}>
            {props.children}
        </SessionContext.Provider>
    );
}
