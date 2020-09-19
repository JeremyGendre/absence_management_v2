import React, {useContext, useEffect, useState} from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

import './PersonnalCalendarScreen.css';
import {Container, Header as SemanticHeader} from "semantic-ui-react";
import {SessionContext} from "../../Component/Context/session";
import MyLoader from "../../Component/MyLoader/MyLoader";

export default function PersonnalCalendarScreen(props){
    const [personalEvents, setPersonalEvents] = useState([]);
    const user = useContext(SessionContext);

    useEffect(() => {
        axios.get('/api/holiday/user/' + user.user.id + '/events').then(data => {
            setPersonalEvents(data.data);
        }).catch(error => {
            console.error(error);
        });
    },[]);

    return(
        <Container className="custom-containers">
            <SemanticHeader as="h1" className="text-center">Mon calendrier</SemanticHeader>
            {personalEvents.length > 0 ? (
                <FullCalendar plugins={[ dayGridPlugin ]} events={personalEvents}/>
            ) : (
                <MyLoader size="big"/>
            )}
        </Container>
    );
}