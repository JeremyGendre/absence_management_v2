import React, {useEffect, useState} from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import './ColleaguesCalendarScreen.css';
import {Container, Header as SemanticHeader} from "semantic-ui-react";
import axios from "axios";
import MyLoader from "../../Component/MyLoader/MyLoader";

export default function ColleaguesCalendarScreen(props){
    const [colleagueEvents, setColleagueEvents] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        axios.get('/api/holiday/all/events').then(data => {
            setColleagueEvents(data.data);
            setLoadingData(false);
        }).catch(error => {
            console.error(error);
            setLoadingData(false);
        });
    },[]);

    return(
        <Container className="custom-containers">
            <SemanticHeader as="h1" className="text-center">Calendrier de mes collègues</SemanticHeader>
            {loadingData ? (
                <MyLoader size="big"/>
            ) : (
                <FullCalendar plugins={[ dayGridPlugin ]} events={colleagueEvents}/>
            )}
        </Container>
    );
}