import React, {useEffect, useState} from "react";
import axios from "axios";
import {servicesToSelectable} from "../../utils/service";
import {Grid, Tab, Table} from "semantic-ui-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function ServiceAdminList(props){
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState([]);

    useEffect(()=>{
        axios.get('/api/service/all').then((result)=>{
            setServices(result.data);
        }).catch((error)=>{
            console.log(error);
            MySwal.fire({icon:'error',title:'Une erreur est survenue : ' + error.message});
        }).finally(()=>{
            setLoadingServices(false);
        });
    },[]);

    return (
        <Tab.Pane attached={false} loading={loadingServices}>
            <Grid columns={2}>
                <Grid.Column>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Nom</Table.HeaderCell>
                                <Table.HeaderCell/>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>tg</Table.Cell>
                                <Table.Cell>ouais</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
}