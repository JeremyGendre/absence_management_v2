import React from "react";

import './TabularCalendarScreen.css';
import {Container, Header as SemanticHeader} from "semantic-ui-react";

export default function TabularCalendarScreen(props){

    return(
        <Container className="custom-containers">
            <SemanticHeader as="h1" className="text-center">Calendrier tabulaire</SemanticHeader>
            <p>Coming soon (inch)</p>
        </Container>
    );
}