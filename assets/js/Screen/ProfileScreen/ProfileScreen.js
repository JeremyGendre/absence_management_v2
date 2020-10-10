import React, {useContext, useEffect, useState} from "react";
import {
    Container,
    Header as SemanticHeader, Tab
} from 'semantic-ui-react';
import './ProfileScreen.css';
import MyLoader from "../../Component/MyLoader/MyLoader";
import axios from "axios";
import Profile from "../../Component/User/Profile";
import {SessionContext} from "../../Component/Context/session";
import PasswordForm from "../../Component/User/PasswordForm";
import {servicesToSelectable} from "../../utils/service";
import {THEME_VALUES, ThemeContext} from "../../Component/Context/Theme";

export default function ProfileScreen(props){
    const [loadingData,setLoadingData] = useState(true);
    const [services,setServices] = useState([
        {
            key:0,
            value:0,
            text:'Aucune entrée'
        }
    ]);

    const user = useContext(SessionContext);
    const theme = useContext(ThemeContext);

    useEffect(()=>{
        axios.get('/api/service/all').then((result)=>{
            setServices(servicesToSelectable(result.data));
        }).catch((error)=>{
            console.log(error);
        }).finally(()=>{
            setLoadingData(false);
        });
    },[]);

    const panes = [
        {
            menuItem: { key: 'profile', icon: 'user', content: 'Profil' },
            render: () =>
                <Tab.Pane inverted={theme.value === THEME_VALUES.dark}>
                    <Profile services={services} user={user}/>
                </Tab.Pane>
        },
        {
            menuItem: { key: 'password', icon: 'key', content: 'Mot de passe' },
            render: () =>
                <Tab.Pane inverted={theme.value === THEME_VALUES.dark}>
                    <PasswordForm/>
                </Tab.Pane>
        },
    ];

    return(
        <>
            {loadingData ? (
                <MyLoader size="big"/>
            ) : (
                <Container className="profile-container custom-containers">
                    <SemanticHeader as='h1' className="classic-head-title">Mon Profil</SemanticHeader>
                    <Tab
                        menu={{ fluid: true, vertical: true, inverted: theme.value === THEME_VALUES.dark }}
                        menuPosition='left'
                        panes={panes}
                    />
                </Container>
            )}
        </>
    );
}