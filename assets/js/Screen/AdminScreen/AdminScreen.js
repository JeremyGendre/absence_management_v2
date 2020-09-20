import React, {useContext, useEffect, useState} from "react";
import axios from 'axios';
import {
    Container,
    Header as SemanticHeader, Icon, Input, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow,
} from 'semantic-ui-react';
import './AdminScreen.css';
import {displayDate, getTimeBetweenTwoDates} from "../../utils/date";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {Redirect} from "react-router-dom";
import {SessionContext} from "../../Component/Context/session";
import {STATUS_ASKED} from "../../utils/holidaysStatus";
import {isBadResult} from "../../utils/server";

const MySwal = withReactContent(Swal);

function convertListToAdminListFormat(holidays){
    let result = [];
    holidays.map(holiday => {
        result.push(convertOneToAdminListFormat(holiday));
    });
    return result;
}

function convertOneToAdminListFormat(holiday){
    let newStartDate = new Date(holiday.start_date.date);
    let newEndDate = new Date(holiday.end_date.date);
    return {
        key: holiday.id,
        person: holiday.user.display_name,
        service: holiday.user.service.name,
        start: displayDate(newStartDate),
        end: displayDate(newEndDate),
        duration: getTimeBetweenTwoDates(newStartDate,newEndDate)
    };
}

export default function AdminScreen(props){
    const [searchLoading,setSearchLoading] = useState(false);
    const [holidaysListDisplayed,setHolidaysListDisplayed] = useState([]);
    const [holidaysListFull,setHolidaysListFull] = useState([]);
    const user = useContext(SessionContext);

    let searching = setTimeout(() => {},100);

    useEffect(() => {
        axios.get('/api/holiday/status/' + STATUS_ASKED).then(data => {
            let returnedMessage = isBadResult(data);
            if(returnedMessage !== ''){
                MySwal.fire({icon:'error',title:returnedMessage});
            }else{
                let convertedHolidays = convertListToAdminListFormat(data.data);
                setHolidaysListDisplayed(convertedHolidays);
                setHolidaysListFull(convertedHolidays);
            }
        }).catch(error => {
            console.error(error);
        });
    },[]);

    function handleAcceptClick(){
        MySwal.fire({
            title: 'Accepter cette demande ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, accepter'
        }).then((result) => {
            if (result.value) {
                MySwal.fire({
                    icon:'success',
                    title:'Demande acceptée'
                });
            }
        });
    }

    function handleRefuseClick(){
        MySwal.fire({
            title: 'Refuser cette demande ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, refuser'
        }).then((result) => {
            if (result.value) {
                MySwal.fire({
                    icon:'success',
                    title:'Demande refusée'
                });
            }
        });
    }

    function handleSearchChange(data){
        clearTimeout(searching);
        setSearchLoading(true);
        searching = setTimeout(function(){
            if(!data.value){
                setSearchLoading(false);
                setHolidaysListDisplayed(holidaysListFull);
                return;
            }
            setSearchLoading(false);
            setHolidaysListDisplayed(checkHolidaySearch(holidaysListFull,data.value));
        },800);
    }

    function checkHolidaySearch(holidays, value){
        let result = [];
        holidays.forEach((holiday) => {
            if(holiday.person.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || holiday.service.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || holiday.start.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || holiday.end.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || holiday.duration === parseInt(value)){
                result.push(holiday);
            }
        });
        return result;
    }

    if(user.isAdmin === false){
        return <Redirect to='/403'/>;
    }
    return(
        <Container className="profile-container custom-containers">
            <SemanticHeader as='h1' className="classic-head-title">Page Administrateur</SemanticHeader>
            <Input className="float-right" icon="search" onChange={(e,data) => handleSearchChange(data)} loading={searchLoading} placeholder="Rechercher"/><br/><br/>
            <Table selectable>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Personne</TableHeaderCell>
                        <TableHeaderCell>Service</TableHeaderCell>
                        <TableHeaderCell>Début</TableHeaderCell>
                        <TableHeaderCell>Fin</TableHeaderCell>
                        <TableHeaderCell>Durée (j)</TableHeaderCell>
                        <TableHeaderCell> </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* LOOP ON DATA HERE */}
                    {holidaysListDisplayed.map((data) => {
                        return(
                            <TableRow key={data.key}>
                                <TableCell>{data.person}</TableCell>
                                <TableCell>{data.service}</TableCell>
                                <TableCell>{data.start}</TableCell>
                                <TableCell>{data.end}</TableCell>
                                <TableCell>{data.duration}</TableCell>
                                <TableCell>
                                    <Icon name="check" className="admin-list-icons status-accepted" onClick={handleAcceptClick} title="Accepter"/>
                                    <Icon name="close" className="admin-list-icons status-close" onClick={handleRefuseClick} title="Refuser"/>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Container>
    );
}