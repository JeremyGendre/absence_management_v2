import React, {useContext, useEffect, useState} from "react";
import {
    Container,
    Header as SemanticHeader, Tab
} from 'semantic-ui-react';
import './ProfileScreen.css';
import MyLoader from "../../Component/MyLoader/MyLoader";
import axios from "axios";
import {isBadResult} from "../../utils/server";
import Profile from "../../Component/User/Profile";
import {SessionContext} from "../../Component/Context/session";
import PasswordForm from "../../Component/User/PasswordForm";

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

    useEffect(()=>{
        axios.get('/api/service/all').then((result)=>{
            if(isBadResult(result) === ''){
                let newServiceList = [];
                result.data.forEach(service => {
                    newServiceList.push({
                        key:service.id,
                        value:service.id,
                        text:service.name
                    });
                });
                setServices(newServiceList);
                setLoadingData(false);
            }
        }).catch((error)=>{
            setLoadingData(false);
            console.log(error);
        });
    },[]);

    const panes = [
        {
            menuItem: { key: 'profile', icon: 'user', content: 'Profil' },
            render: () =>
                <Tab.Pane>
                    <Profile services={services} user={user}/>
                </Tab.Pane>
        },
        {
            menuItem: { key: 'password', icon: 'key', content: 'Mot de passe' },
            render: () =>
                <Tab.Pane>
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
                        menu={{ fluid: true, vertical: true }}
                        menuPosition='left'
                        panes={panes}
                    />
                </Container>
            )}
        </>
    );
}