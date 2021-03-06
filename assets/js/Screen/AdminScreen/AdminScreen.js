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
import ServiceAdminList from "../../Component/Admin/ServiceAdminList";
import {THEME_VALUES, ThemeContext} from "../../Component/Context/Theme";
import FixedHolidaysAdminList from "../../Component/Admin/FixedHolidaysAdminList";

export default function AdminScreen(props){
    const user = useContext(SessionContext);
    const theme = useContext(ThemeContext);

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
        {
            menuItem: { key: 'services', icon: 'sitemap', content: 'Services' },
            render: () =>
                <ServiceAdminList/>
        },
        {
            menuItem: { key: 'Jours Fériés', icon: 'calendar alternate', content: 'Jours Fériés' },
            render: () =>
                <FixedHolidaysAdminList/>
        },
    ];

    if(user.isAdmin === false){
        return <Redirect to='/403'/>;
    }
    return(
        <Container className="profile-container custom-containers">
            <SemanticHeader as='h1' className="classic-head-title">Page Administrateur</SemanticHeader>
            <Tab menu={{ secondary: true, pointing: true, inverted: theme.value === THEME_VALUES.dark }} panes={panes} />
        </Container>
    );
}