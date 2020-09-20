import React, {useContext, useEffect, useState} from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import './ServiceCalendarScreen.css';
import {Container, Header as SemanticHeader} from "semantic-ui-react";
import axios from "axios";
import {SessionContext} from "../../Component/Context/session";
import MyLoader from "../../Component/MyLoader/MyLoader";

export default function ServiceCalendarScreen(props){
    const [serviceEvents, setServiceEvents] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const user = useContext(SessionContext);

    useEffect(() => {
        axios.get('/api/holiday/service/'+ user.user.service.id +'/events').then(data => {
            setServiceEvents(data.data);
            setLoadingData(false);
        }).catch(error => {
            console.error(error);
            setLoadingData(false);
        });
    },[]);

    return(
        <Container className="custom-containers">
            <SemanticHeader as="h1" className="text-center">Calendrier de mon service</SemanticHeader>
            {loadingData ? (
                <MyLoader size="big"/>
            ) : (
                <FullCalendar plugins={[ dayGridPlugin ]} events={serviceEvents}/>
            )}
        </Container>
    );
}