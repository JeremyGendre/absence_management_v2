import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    Container,
    Header as SemanticHeader, Icon, Loader,
    Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow,
} from 'semantic-ui-react';
import {displayDate, getTimeBetweenTwoDates, isDatePassed} from "../../utils/date";
import './HolidayListScreen.css';
import {STATUS_ACCEPTED, STATUS_ASKED, STATUS_LABEL, STATUS_REJECTED} from "../../utils/holidaysStatus";
import MyLoader from "../../Component/MyLoader/MyLoader";
import axios from 'axios';
import {SessionContext} from "../../Component/Context/session";
import {isBadResult} from "../../utils/server";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {getShortType} from "../../utils/holidaysTypes";
import {removeFromArray} from "../../utils/functions";

const MySwal = withReactContent(Swal);

export default function HolidayListScreen(props){
    const [loadingData,setLoadingData] = useState(true);
    const [listHolidays,setListHolidays] = useState([]);
    const [holidaysBeingDeleted,setHolidaysBeingDeleted] = useState([]);
    const user = useContext(SessionContext);

    useEffect(()=>{
        axios.get('/api/holiday/user/'+user.user.id).then(result => {
            let messageResult = isBadResult(result);
            if(messageResult !== ''){// erreur
                MySwal.fire({icon:'error', title:messageResult});
                setLoadingData(false);
            }else{ // ok
                let holidays = result.data;
                let newHolidaysList = [];
                holidays.forEach(holiday => {
                    let startDate = new Date(holiday.start_date.date);
                    let endDate = new Date(holiday.end_date.date);
                    newHolidaysList.push({
                        key:holiday.id,
                        start:startDate,
                        end:endDate,
                        duration:getTimeBetweenTwoDates(startDate,endDate),
                        type: getShortType(holiday.type),
                        status:holiday.status
                    });
                });
                setLoadingData(false);
                setListHolidays(newHolidaysList);
            }
        }).catch(error => {// erreur
            MySwal.fire({icon:'error', title:"Une erreur est survenue"});
            console.log(error);
            setLoadingData(false);
        })
    },[]);

    function handleDeleteClick(holiday){
        MySwal.fire({
            title: 'Annuler ces congés ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, annuler'
        }).then((result) => {
            if (result.value) {
                setHolidaysBeingDeleted([...holidaysBeingDeleted,holiday.key]);
                axios.delete('/api/holiday/delete/'+holiday.key).then(result => {
                    let messageResult = isBadResult(result);
                    if(messageResult !== ''){//erreur
                        MySwal.fire({icon:'error', title:messageResult});
                    }else{//ok
                        let newHolidaysList = [];
                        listHolidays.forEach(oneHoliday => {
                            if(oneHoliday.key !== holiday.key){
                                newHolidaysList.push(oneHoliday);
                            }
                        });
                        setListHolidays(newHolidaysList);
                        MySwal.fire({icon:'success', title:'Congés annulés'});
                    }
                }).catch(error => {
                    MySwal.fire({icon:'error', title:'Une erreur est survenue'});
                    console.log(error);
                }).finally(() => {
                    setHolidaysBeingDeleted(removeFromArray(holiday.key,holidaysBeingDeleted));
                });
            }
        });
    }

    return(
        <Container className="custom-containers">
            <SemanticHeader as='h1' className="classic-head-title">Mes congés</SemanticHeader>
            <Table selectable textAlign="center" className="p-relative">
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Debut</TableHeaderCell>
                        <TableHeaderCell>Fin</TableHeaderCell>
                        <TableHeaderCell>Durée (j)</TableHeaderCell>
                        <TableHeaderCell>Type</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell/>
                    </TableRow>
                </TableHeader>
                {loadingData ? (
                    <TableBody className="p-relative">
                        <MyLoader size="small" fitTable={6} block style={{paddingTop:"5px"}}/>
                    </TableBody>
                ) : (
                    <TableBody>
                        {listHolidays.length === 0 && (
                            <TableRow key={0}>
                                <TableCell/>
                                <TableCell/>
                                <TableCell>Aucun congés</TableCell>
                                <TableCell/>
                                <TableCell/>
                                <TableCell/>
                            </TableRow>
                        )}
                        {listHolidays.length !== 0 && listHolidays.map((data) => {
                            let statusIcon = '';
                            let status = '';
                            switch(data.status){
                                case STATUS_ASKED:
                                    statusIcon = <Icon name="question circle outline" className="status-asked"/>;
                                    status = STATUS_LABEL.STATUS_ASKED;
                                    break;
                                case STATUS_ACCEPTED:
                                    statusIcon = <Icon name="check" className="status-accepted"/>;
                                    status = STATUS_LABEL.STATUS_ACCEPTED;
                                    break;
                                case STATUS_REJECTED:
                                    statusIcon = <Icon name="close" className="status-close"/>;
                                    status = STATUS_LABEL.STATUS_REJECTED;
                                    break;
                                default:
                                    statusIcon = <Icon name="question circle outline"/>;
                                    status = '';
                                    break;
                            }
                            return(
                                <TableRow id={"user-holiday-"+data.key} key={data.key}>
                                    <TableCell>{displayDate(data.start)}</TableCell>
                                    <TableCell>{displayDate(data.end)}</TableCell>
                                    <TableCell>{data.duration}</TableCell>
                                    <TableCell>{data.type}</TableCell>
                                    <TableCell>{statusIcon} {status}</TableCell>
                                    <TableCell>
                                        {(isDatePassed(data.start) === false) ? (
                                            <Button primary loading={holidaysBeingDeleted.includes(data.key)} disabled={holidaysBeingDeleted.includes(data.key)} onClick={handleDeleteClick.bind(this,data)}>
                                                Annuler
                                            </Button>
                                        ) : (<></>)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                )}
            </Table>
        </Container>
    );
}