import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {THEME_VALUES, ThemeContext} from "../Context/Theme";
import {Grid, Icon, Tab, Table} from "semantic-ui-react";
import {displayErrorPopup} from "../../utils/error";
import NewFixedHoliday from "./NewFixedHoliday";
import {getMonthName} from "../../utils/date";
import {MySwal,Swal} from "../../utils/MySwal";
import {isBadResult} from "../../utils/server";
import {removeFromArray} from "../../utils/functions";

export default function FixedHolidaysAdminList(props){
    const theme = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [fixedHolidays, setFixedHolidays] = useState([]);
    const [fixedHolidaysBeingProcessed, setFixedHolidaysBeingProcessed] = useState([]);

    useEffect(()=>{
        axios.get('/api/fixed/holiday/all').then(result => {
            setFixedHolidays(result.data);
        }).catch( displayErrorPopup ).finally(() => setLoading(false))
    },[]);

    const handleDeleteFixedHoliday = (oneFixedHoliday) => {
        MySwal.fire({
            title: 'Supprimer ce jour férié ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => {
                setFixedHolidaysBeingProcessed([...fixedHolidaysBeingProcessed,oneFixedHoliday.id]);
                return axios.delete(
                    '/api/fixed/holiday/delete/' + oneFixedHoliday.id
                ).then(result => {
                    const errorMessage = isBadResult(result);
                    if(errorMessage !== ''){
                        Swal.showValidationMessage(`Request failed: ${errorMessage}`);
                    }else{
                        setFixedHolidays(removeFromArray(oneFixedHoliday,fixedHolidays));
                        return result.data;
                    }
                }).catch(error => {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                });
            }
        }).then((result) => {
            if(result.isConfirmed){
                console.log(result);
                MySwal.fire({icon:'success',title:result.value.data});
            }
        }).finally(()=>{
            setFixedHolidaysBeingProcessed(removeFromArray(oneFixedHoliday.id,fixedHolidaysBeingProcessed));
        });
    };

    const handleAddNewFixedHoliday = (newFixedHoliday) => {
        setFixedHolidays([...fixedHolidays,newFixedHoliday]);
    };

    return (
        <Tab.Pane className={theme.value === THEME_VALUES.dark ? 'inverted-tab-bg' : ''} inverted={theme.value === THEME_VALUES.dark} attached={false} loading={loading}>
            <Grid columns={2}>
                <Grid.Column width={8}>
                    <Table inverted={theme.value === THEME_VALUES.dark} selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                                <Table.HeaderCell>Créé par</Table.HeaderCell>
                                <Table.HeaderCell/>
                            </Table.Row>
                        </Table.Header>
                        {fixedHolidays.length > 0 ? (
                            <Table.Body>
                                {fixedHolidays.map((oneFixedHoliday,index) => {
                                    return (
                                        <Table.Row key={oneFixedHoliday.id ?? index} disabled={fixedHolidaysBeingProcessed.includes(oneFixedHoliday.id)}>
                                            <Table.Cell>{oneFixedHoliday.day} {getMonthName(oneFixedHoliday.month-1)}</Table.Cell>
                                            <Table.Cell>{oneFixedHoliday.createdBy}</Table.Cell>
                                            <Table.Cell>
                                                <Icon title="Supprimer le jour férié" onClick={handleDeleteFixedHoliday.bind(this,oneFixedHoliday)} className="admin-fixed-holiday-btn button-delete-service cursor-pointer" name="trash"/>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        ) : (
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell/>
                                    <Table.Cell>Aucune données</Table.Cell>
                                    <Table.Cell/>
                                </Table.Row>
                            </Table.Body>
                        ) }
                    </Table>
                </Grid.Column>
                <Grid.Column width={8}>
                    <NewFixedHoliday addFixedHoliday={handleAddNewFixedHoliday}/>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
}