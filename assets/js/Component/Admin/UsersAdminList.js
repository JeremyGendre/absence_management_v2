import React, {useEffect, useState} from "react";
import {
    Icon,
    Input,
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

const MySwal = withReactContent(Swal);

export default function UsersAdminList(props){
    let usersListFull = props.usersList;
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

    return (
        <>
            <Input className="float-right" icon="search" onChange={(e,data) => handleSearchChange(data)} loading={searchLoading} placeholder="Rechercher"/><br/><br/>
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
                            <TableRow key={data.id} disabled={usersBeingProcessed.includes(data.id)}>
                                <TableCell>{data.last_name}</TableCell>
                                <TableCell>{data.first_name}</TableCell>
                                <TableCell>{data.service.name}</TableCell>
                                <TableCell>{data.email}</TableCell>
                                <TableCell>{data.username}</TableCell>
                                <TableCell>{data.created_at}</TableCell>
                                <TableCell>
                                    <Icon title="Modifier l'utilisateur" className="users-list-admin-btn main-color-text button-edit-user" name="edit"/>
                                    <Icon title="Supprimer l'utilisateur" className="users-list-admin-btn button-delete-user" name="delete"/>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}

UsersAdminList.propTypes = {
    usersList:PropTypes.array
};