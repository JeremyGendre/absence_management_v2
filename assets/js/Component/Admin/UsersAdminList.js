import React, {useEffect, useState} from "react";
import {
    Grid,
    Icon,
    Input, Select,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "semantic-ui-react";
import axios from "axios";
import {removeFromArray} from "../../utils/functions";
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './UsersAdminList.css';
import {isBadResult} from "../../utils/server";
import RowUser from "./RowUser";

const MySwal = withReactContent(Swal);

const noServiceOption = { key: 0, value: 0, text: 'Tous les services' };

export default function UsersAdminList(props){
    let usersListFull = props.usersList;
    const services = [noServiceOption,...props.services];
    const [searchLoading,setSearchLoading] = useState(false);
    const [usersListDisplayed,setUsersListDisplayed] = useState([]);
    const [usersBeingProcessed,setUsersBeingProcessed] = useState([]);

    let searching = setTimeout(() => {},100);

    useEffect(()=>{
        setUsersListDisplayed(props.usersList);
    },[props.usersList]);

    function handleSearchChange(data){
        clearTimeout(searching);
        setSearchLoading(true);
        searching = setTimeout(function(){
            if(!data.value){
                setSearchLoading(false);
                setUsersListDisplayed(usersListFull);
                return;
            }
            setSearchLoading(false);
            setUsersListDisplayed(checkUserSearch(usersListFull,data.value));
        },300);
    }

    function checkUserSearch(users, value){
        let result = [];
        users.forEach((user) => {
            if(user.last_name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || user.first_name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || user.service.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || user.email.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || user.username.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || user.created_at.toLocaleLowerCase().includes(value.toLocaleLowerCase())){
                result.push(user);
            }
        });
        return result;
    }

    function handleDeleteUser(user){
        MySwal.fire({
            title: 'Supprimer cet utilisateur ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => {
                setUsersBeingProcessed([...usersBeingProcessed,user.id]);
                return axios.delete(
                    '/api/user/delete/' + user.id
                ).then(data => {
                    let messageResult = isBadResult(data);
                    if(messageResult !== '') {
                        Swal.showValidationMessage(`Request failed: ${messageResult}`);
                    }else{
                        return data.data;
                    }
                }).catch(error => {
                    console.error(error);
                    Swal.showValidationMessage(`Request failed: ${error}`);
                }).finally(()=>{
                    setUsersBeingProcessed(removeFromArray(user.id,usersBeingProcessed));
                });
            }
        }).then((result) => {
            if(result.isConfirmed){
                setUsersListDisplayed(removeFromArray(user,usersListDisplayed));
                MySwal.fire({icon:'success',title:'Utilisateur supprimé'});
            }
        });
    }

    function handleFilterByServiceChange(data){
        if(data === noServiceOption.key){
            setUsersListDisplayed(usersListFull);
        }else{
            setUsersListDisplayed(usersByService(usersListFull,data));
        }
    }

    function usersByService(users,serviceId){
        let usersList = [];
        users.map(oneUser => {
            if(oneUser.service.id === serviceId){
                usersList.push(oneUser);
            }
        });
        return usersList;
    }

    return (
        <>
            <Grid columns={3}>
                <Grid.Row>
                    <Grid.Column>
                        <Input className="float-right" icon="search" onChange={(e,data) => handleSearchChange(data)} loading={searchLoading} placeholder="Rechercher"/>
                    </Grid.Column>
                    <Grid.Column>
                        <Select placeholder="Tri sur un service" onChange={(e,data) => handleFilterByServiceChange(data.value)} options={services}/>
                    </Grid.Column>
                    <Grid.Column/>
                </Grid.Row>
            </Grid>
            <br/><br/>
            <Table selectable>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Nom</TableHeaderCell>
                        <TableHeaderCell>Prénom</TableHeaderCell>
                        <TableHeaderCell>Service</TableHeaderCell>
                        <TableHeaderCell>Email</TableHeaderCell>
                        <TableHeaderCell>Username</TableHeaderCell>
                        <TableHeaderCell>Créé le</TableHeaderCell>
                        <TableHeaderCell> </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usersListDisplayed.length === 0 && (
                        <TableRow key={0}>
                            <TableCell/>
                            <TableCell/>
                            <TableCell/>
                            <TableCell>Aucunes données</TableCell>
                            <TableCell/>
                            <TableCell/>
                            <TableCell/>
                        </TableRow>
                    )}
                    {usersListDisplayed.length !== 0 && usersListDisplayed.map((data) => {
                        return(
                            <RowUser
                                user={data}
                                key={data.id}
                                processed={usersBeingProcessed.includes(data.id)}
                                handleDelete={handleDeleteUser}
                            />
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}

UsersAdminList.propTypes = {
    usersList: PropTypes.array,
    services: PropTypes.array
};