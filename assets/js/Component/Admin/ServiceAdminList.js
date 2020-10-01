import React, {useEffect, useState} from "react";
import axios from "axios";
import {Grid, Icon, Tab, Table} from "semantic-ui-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './ServiceAdminList.css';

const MySwal = withReactContent(Swal);

export default function ServiceAdminList(props){
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);

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

    function handleEditService(oneService){
        console.log('edit ',oneService);
    }

    function handleDeleteService(oneService){
        console.log('delete ',oneService);
    }

    return (
        <Tab.Pane attached={false} loading={loadingServices}>
            <Grid columns={2}>
                <Grid.Column width={8}>
                    <Table selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Identifiant</Table.HeaderCell>
                                <Table.HeaderCell>Nom</Table.HeaderCell>
                                <Table.HeaderCell/>
                            </Table.Row>
                        </Table.Header>
                        {services.length > 0 ? (
                            <Table.Body>
                                {services.map(oneService => {
                                    return (
                                        <Table.Row key={oneService.id}>
                                            <Table.Cell>{oneService.id}</Table.Cell>
                                            <Table.Cell>{oneService.name}</Table.Cell>
                                            <Table.Cell>
                                                <Icon title="Modifier le nom" onClick={handleEditService.bind(this,oneService)} className="admin-service-btn button-edit-service" name="edit"/>
                                                {
                                                    (oneService.isDeletable === true)
                                                    &&
                                                    <Icon title="Supprimer le service" onClick={handleDeleteService.bind(this,oneService)} className="admin-service-btn button-delete-service" name="trash"/>
                                                }
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        ) : (
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>Aucune données</Table.Cell>
                                    <Table.Cell/>
                                </Table.Row>
                            </Table.Body>
                        ) }
                    </Table>
                </Grid.Column>
                <Grid.Column width={8}>
                    ouais
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
}