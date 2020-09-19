import React from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import './ColleaguesCalendarScreen.css';
import {Container, Header as SemanticHeader} from "semantic-ui-react";
import {STATUS_EVENTS_COLORS} from "../../utils/holidaysStatus";
import {displayDateForCalendar} from "../../utils/date";

const events = [
    {
        title : 'test',
        start : displayDateForCalendar(new Date('2020-05-07')),
        end: displayDateForCalendar(new Date('2020-05-19')),
        backgroundColor:STATUS_EVENTS_COLORS.STATUS_ACCEPTED,
        borderColor:STATUS_EVENTS_COLORS.STATUS_ACCEPTED
    },
    {
        title : 'test2',
        start : displayDateForCalendar(new Date('2020-06-04')),
        end: displayDateForCalendar(new Date('2020-06-05')),
        backgroundColor:STATUS_EVENTS_COLORS.STATUS_ACCEPTED,
        borderColor:STATUS_EVENTS_COLORS.STATUS_ACCEPTED
    },
    {
        title : 'test3',
        start : displayDateForCalendar(new Date('2020-06-13')),
        end: displayDateForCalendar(new Date('2020-06-16')),
        backgroundColor:STATUS_EVENTS_COLORS.STATUS_REJECTED,
        borderColor:STATUS_EVENTS_COLORS.STATUS_REJECTED
    },
    {
        title : 'test4',
        start : displayDateForCalendar(new Date('2020-06-20')),
        end: displayDateForCalendar(new Date('2020-06-21')),
        backgroundColor:STATUS_EVENTS_COLORS.STATUS_ASKED,
        borderColor:STATUS_EVENTS_COLORS.STATUS_ASKED
    },
];

export default function ColleaguesCalendarScreen(props){
    return(
        <Container className="custom-containers">
            <SemanticHeader as="h1" className="text-center">Calendrier de mes collègues</SemanticHeader>
            <FullCalendar plugins={[ dayGridPlugin ]} events={events}/>
        </Container>
    );
}