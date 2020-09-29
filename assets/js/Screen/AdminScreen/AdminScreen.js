import React, {useContext} from "react";
import {
    Container,
    Header as SemanticHeader, Tab,
} from 'semantic-ui-react';
import './AdminScreen.css';
import {Redirect} from "react-router-dom";
import {SessionContext} from "../../Component/Context/session";
import HolidaysAdminList from "../../Component/Admin/HolidaysAdminList";
import UsersAdminList from "../../Component/Admin/UsersAdminList";
import NewUser from "../../Component/Admin/NewUser";

export default function AdminScreen(props){
    const user = useContext(SessionContext);

    const panes = [
        {
            menuItem: { key: 'holidays', icon:'thumbtack', content: 'Congés' },
            render: () =>
                <HolidaysAdminList/>
        },
        {
            menuItem: { key: 'users', icon: 'users', content: 'Utilisateurs' },
            render: () =>
                <UsersAdminList/>
        },
        {
            menuItem: { key: 'newUser', icon: 'user plus', content: 'Nouvel Utilisateur' },
            render: () =>
                <NewUser services={[]}/>
        },
    ];

    if(user.isAdmin === false){
        return <Redirect to='/403'/>;
    }
    return(
        <Container className="profile-container custom-containers">
            <SemanticHeader as='h1' className="classic-head-title">Page Administrateur</SemanticHeader>
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        </Container>
    );
}