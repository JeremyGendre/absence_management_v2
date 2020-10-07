import React, {useContext, useEffect, useState} from "react";
import axios from 'axios';
import './TabularCalendarScreen.css';
import {Container, Header as SemanticHeader, Select} from "semantic-ui-react";
import TabularCalendar from "../../Component/TabularCalendar/TabularCalendar";
import {SessionContext} from "../../Component/Context/session";
import {displayErrorPopup} from "../../utils/error";
import MyLoader from "../../Component/MyLoader/MyLoader";
import {servicesToSelectable} from "../../utils/service";

export default function TabularCalendarScreen(props){
    const userContext = useContext(SessionContext);
    const [datas, setDatas] = useState([{userName : userContext.user.first_name + ' ' + userContext.user.last_name}]);
    const [datasLoading, setDatasLoading] = useState(true);
    const [serviceList, setServiceList] = useState([]);
    const [service, setService] = useState(userContext.user.service.id);

    useEffect(() => {
        axios.get('/api/service/all').then((result)=>{
            setServiceList(servicesToSelectable(result.data));
        }).catch((error)=>{
            console.log(error);
            displayErrorPopup(error);
        });
    },[]);

    useEffect(() => {
        if(datasLoading === false){
            setDatasLoading(true);
        }
        axios.get('/api/holiday/service/tabular/'+service).then(result => {
            setDatas(result.data);
        }).catch(error => {
            displayErrorPopup(error);
            console.error(error);
        }).finally(()=>{
            setDatasLoading(false);
        })
    },[service]);

    return(
        <Container className="custom-containers tabular-container">
            <SemanticHeader as="h1" className="text-center">Calendrier tabulaire</SemanticHeader>
            {userContext.isAdmin && <div className="text-center"><Select placeholder="Filtre sur un service" value={service} onChange={(e,data) => setService(data.value)} options={serviceList}/></div>}
            {datasLoading ? (
                <MyLoader size="big"/>
            ) : (
                <TabularCalendar data={datas} loading={datasLoading}/>
            )}
        </Container>
    );
}