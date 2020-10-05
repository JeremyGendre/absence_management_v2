import React, {useContext, useEffect, useState} from "react";
import axios from 'axios';
import './TabularCalendarScreen.css';
import {Container, Header as SemanticHeader} from "semantic-ui-react";
import TabularCalendar from "../../Component/TabularCalendar/TabularCalendar";
import {SessionContext} from "../../Component/Context/session";

export default function TabularCalendarScreen(props){
    const userContext = useContext(SessionContext);
    const [datas, setDatas] = useState([{userName : userContext.user.first_name + ' ' + userContext.user.last_name}]);
    const [datasLoading, setDatasLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/user/all/'+userContext.user.service.id).then(result => {
            console.log(result);
        }).catch(error => {
            console.error(error);
        }).finally(()=>{
            setDatasLoading(false);
        })
    },[]);

    return(
        <Container className="custom-containers">
            <SemanticHeader as="h1" className="text-center">Calendrier tabulaire</SemanticHeader>
            <TabularCalendar data={datas} loading={datasLoading}/>
        </Container>
    );
}