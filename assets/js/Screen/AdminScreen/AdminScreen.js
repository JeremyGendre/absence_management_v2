import React, {useContext, useEffect, useState} from "react";
import axios from 'axios';
import {
    Container,
    Header as SemanticHeader, Tab,
} from 'semantic-ui-react';
import './AdminScreen.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {Redirect} from "react-router-dom";
import {SessionContext} from "../../Component/Context/session";
import {STATUS_ASKED} from "../../utils/holidaysStatus";
import {isBadResult} from "../../utils/server";
import {convertListToAdminListFormat} from "../../utils/holidayFormat";
import HolidaysAdminList from "../../Component/Admin/HolidaysAdminList";
import UsersAdminList from "../../Component/Admin/UsersAdminList";

const MySwal = withReactContent(Swal);

export default function AdminScreen(props){
    const [loadingHolidays,setLoadingHolidays] = useState(true);
    const [holidaysListFull,setHolidaysListFull] = useState([]);
    const user = useContext(SessionContext);

    useEffect(() => {
        axios.get('/api/holiday/status/' + STATUS_ASKED).then(data => {
            let returnedMessage = isBadResult(data);
            if(returnedMessage !== ''){
                MySwal.fire({icon:'error',title:returnedMessage});
            }else{
                let convertedHolidays = convertListToAdminListFormat(data.data);
                setHolidaysListFull(convertedHolidays);
            }
        }).catch(error => {
            console.error(error);
        }).finally(()=>{
            setLoadingHolidays(false);
        });
    },[]);

    const panes = [
        {
            menuItem: { key: 'holidays', icon:'thumbtack', content: 'Congés' },
            render: () =>
                <Tab.Pane attached={false} loading={loadingHolidays}>
                    <HolidaysAdminList holidaysList={holidaysListFull}/>
                </Tab.Pane>
        },
        {
            menuItem: { key: 'users', icon: 'users', content: 'Utilisateurs' },
            render: () =>
                <UsersAdminList/>
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