import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {THEME_VALUES, ThemeContext} from "../Context/Theme";
import {Grid, Icon, Tab, Table} from "semantic-ui-react";
import {displayErrorPopup} from "../../utils/error";
import NewFixedHoliday from "./NewFixedHoliday";

export default function FixedHolidaysAdminList(props){
    const theme = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [fixedHolidays, setFixedHolidays] = useState([]);
    const [fixedHolidaysBeingProcessed, setFixedHolidaysBeingProcessed] = useState([]);

    useEffect(()=>{
        axios.get('/api/fixed/holiday/all').then(result => {
            setFixedHolidays(result.data);
        }).catch(error => {
            console.log(error);
            displayErrorPopup(error);
        }).finally(() => setLoading(false))
    },[])

    const handleDeleteFixedHoliday = (oneFixedHoliday) => {
        console.log(oneFixedHoliday);
    }

    const handleAddNewFixedHoliday = (newFixedHoliday) => {
        setFixedHolidays([...fixedHolidays,newFixedHoliday]);
    }

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
                                {fixedHolidays.map(oneFixedHoliday => {
                                    return (
                                        <Table.Row key={oneFixedHoliday.id} disabled={fixedHolidaysBeingProcessed.includes(oneFixedHoliday.id)}>
                                            <Table.Cell>{oneFixedHoliday.day}</Table.Cell>
                                            <Table.Cell>{oneFixedHoliday.createdBy}</Table.Cell>
                                            <Table.Cell>
                                                <Icon title="Supprimer le jour férié" onClick={handleDeleteFixedHoliday.bind(this,oneFixedHoliday)} className="admin-fixed-holiday-btn button-delete-service" name="trash"/>
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