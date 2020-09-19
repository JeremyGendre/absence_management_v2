import React, {useEffect, useState} from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import './ColleaguesCalendarScreen.css';
import {Container, Header as SemanticHeader} from "semantic-ui-react";
import axios from "axios";

export default function ColleaguesCalendarScreen(props){
    const [colleagueEvents, setColleagueEvents] = useState([]);

    useEffect(() => {
        axios.get('/api/holiday/all/events').then(data => {
            setColleagueEvents(data.data);
        }).catch(error => {
            console.error(error);
        });
    },[]);

    return(
        <Container className="custom-containers">
            <SemanticHeader as="h1" className="text-center">Calendrier de mes collègues</SemanticHeader>
            <FullCalendar plugins={[ dayGridPlugin ]} events={colleagueEvents}/>
        </Container>
    );
}