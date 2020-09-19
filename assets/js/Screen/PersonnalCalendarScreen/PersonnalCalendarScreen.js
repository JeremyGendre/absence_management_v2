import React from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import './PersonnalCalendarScreen.css';
import {Container, Header as SemanticHeader} from "semantic-ui-react";
import {STATUS_EVENTS_COLORS} from "../../utils/holidaysStatus";
import {displayDateForCalendar} from "../../utils/date";

const events = [
    {
        title : 'test',
        start : displayDateForCalendar(new Date('2020-09-06')),
        end: displayDateForCalendar(new Date('2020-09-20')),
        backgroundColor:STATUS_EVENTS_COLORS.STATUS_ACCEPTED,
        borderColor:STATUS_EVENTS_COLORS.STATUS_ACCEPTED
    },
    {
        title : 'test2',
        start : displayDateForCalendar(new Date('2020-09-03')),
        end: displayDateForCalendar(new Date('2020-09-05')),
        backgroundColor:STATUS_EVENTS_COLORS.STATUS_ACCEPTED,
        borderColor:STATUS_EVENTS_COLORS.STATUS_ACCEPTED
    },
    {
        title : 'test3',
        start : displayDateForCalendar(new Date('2020-09-12')),
        end: displayDateForCalendar(new Date('2020-09-13')),
        backgroundColor:STATUS_EVENTS_COLORS.STATUS_REJECTED,
        borderColor:STATUS_EVENTS_COLORS.STATUS_REJECTED
    },
    {
        title : 'test4',
        start : displayDateForCalendar(new Date('2020-09-15')),
        end: displayDateForCalendar(new Date('2020-09-15')),
        backgroundColor:STATUS_EVENTS_COLORS.STATUS_ASKED,
        borderColor:STATUS_EVENTS_COLORS.STATUS_ASKED
    },
];

export default function PersonnalCalendarScreen(props){
    return(
        <Container className="custom-containers">
            <SemanticHeader as="h1" className="text-center">Mon calendrier</SemanticHeader>
            <FullCalendar plugins={[ dayGridPlugin ]} events={events}/>
        </Container>
    );
}