import React, {useEffect, useState} from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import './ServiceCalendarScreen.css';
import {Container, Header as SemanticHeader} from "semantic-ui-react";
import axios from "axios";

export default function ServiceCalendarScreen(props){
    const [serviceEvents, setServiceEvents] = useState([]);

    useEffect(() => {
        axios.get('/api/holiday/all/events').then(data => {
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