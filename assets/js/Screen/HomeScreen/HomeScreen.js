import React from "react";
import {Container, Header as SemanticHeader} from "semantic-ui-react";

export default function HomeScreen(props){
    return(
        <Container className="custom-containers">
            <SemanticHeader as='h1' className="text-center">Bienvenue dans Jorani v2 ! :)</SemanticHeader>
        </Container>
    );
}