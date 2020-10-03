import React, {useEffect, useState} from "react";
import axios from "axios";
import {Grid, Icon, Input, Select, Tab, Table} from "semantic-ui-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './ServiceAdminList.css';
import {removeFromArray} from "../../utils/functions";
import {editServiceInList} from "../../utils/service";
import NewService from "./NewService";

const MySwal = withReactContent(Swal);

export default function ServiceAdminList(props){
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [servicesBeingProcessed, setServicesBeingProcessed] = useState([]);

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
        let newName = oneService.name;
        MySwal.fire({
            title: 'Modification du service ' + oneService.id,
            html:<Input label="Nom du service" minLength="1" maxLength="100" defaultValue={oneService.name} onChange={(e,data) => newName = data.value} />,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Modifier',
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => {
                if(checkServiceName(newName) === false){
                    Swal.showValidationMessage('Le nom doit être compris entre 1 et 100 charactères');
                }else{
                    setServicesBeingProcessed([...servicesBeingProcessed,oneService.id]);
                    return axios.put(
                        '/api/service/'+ oneService.id +'/edit',{name: newName}
                    ).then(data => {
                        setServices(editServiceInList(services,data.data));
                        return data.data;
                    }).catch(error => {
                        console.error(error);
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    }).finally(()=>{
                        setServicesBeingProcessed(removeFromArray(oneService.id,servicesBeingProcessed));
                    });
                }
            }
        }).then((result) => {
            if(result.isConfirmed){
                MySwal.fire({icon:'success',title:"Service modifié"});
            }
        });
    }

    function checkServiceName(serviceName)
    {
        return serviceName.length > 0 && serviceName.length < 100;
    }

    function handleDeleteService(oneService){
        MySwal.fire({
            title: 'Supprimer ce service ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => {
                setServicesBeingProcessed([...servicesBeingProcessed,oneService.id]);
                return axios.delete(
                    '/api/service/delete/' + oneService.id
                ).then(data => {
                    setServices(removeFromArray(oneService,services));
                    return data.data;
                }).catch(error => {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                });
            }
        }).then((result) => {
            if(result.isConfirmed){
                MySwal.fire({icon:'success',title:'Service supprimé'});
            }
        }).finally(()=>{
            setServicesBeingProcessed(removeFromArray(oneService.id,servicesBeingProcessed));
        });
    }

    function addService(oneService){
        setServices([...services,oneService]);
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
                                        <Table.Row key={oneService.id} disabled={servicesBeingProcessed.includes(oneService.id)}>
                                            <Table.Cell>{oneService.id}</Table.Cell>
                                            <Table.Cell>{oneService.name}</Table.Cell>
                                            <Table.Cell>
                                                {
                                                    (oneService.isDeletable === true)
                                                    && (
                                                        <>
                                                            <Icon title="Modifier le nom" onClick={handleEditService.bind(this,oneService)} className="admin-service-btn button-edit-service" name="edit"/>
                                                            <Icon title="Supprimer le service" onClick={handleDeleteService.bind(this,oneService)} className="admin-service-btn button-delete-service" name="trash"/>
                                                        </>
                                                    )
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
                    <NewService addService={addService}/>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
}