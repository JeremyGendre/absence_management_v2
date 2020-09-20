import React, {useContext, useEffect, useState} from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import './ServiceCalendarScreen.css';
import {Container, Header as SemanticHeader} from "semantic-ui-react";
import axios from "axios";
import {SessionContext} from "../../Component/Context/session";

export default function ServiceCalendarScreen(props){
    const [serviceEvents, setServiceEvents] = useState([]);
    const user = useContext(SessionContext);

    useEffect(() => {
        axios.get('/api/holiday/service/'+ user.user.service.id +'/events').then(data => {
            setServiceEvents(data.data);
        }).catch(error => {
            console.error(error);
        });
    },[]);

    return(
        <Container className="custom-containers">
            <SemanticHeader as="h1" className="text-center">Calendrier de mon service</SemanticHeader>
            <FullCalendar plugins={[ dayGridPlugin ]} events={serviceEvents}/>
        </Container>
    );
}