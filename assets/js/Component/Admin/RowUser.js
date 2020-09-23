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
import {isBadResult} from "../../utils/server";
import Profile from "../User/Profile";

const MySwal = withReactContent(Swal);

export default function RowUser(props){
    const [user,setUser] = useState({});
    const [userBeingProcessed,setUserBeingProcessed] = useState(false);

    useEffect(()=>{
        setUser(props.user);
    },[props.user]);

    function handleUpdateUser(user){
        MySwal.fire({
            title: "Modification d'utilisateur",
            html: (<Profile user={{user:user}} services={props.servicesOptions}/>),
            width: window.innerWidth/2,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Confirmer',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !MySwal.isLoading(),
            preConfirm: () => {
                setUserBeingProcessed(true);
                return axios.put('/api/user/edit/' + user.id,{
                    first_name:user.first_name,
                    last_name:user.last_name,
                    email:user.email,
                    service:user.service.id,
                    title:user.title,
                    username:user.username
                }).then(data => {
                    let resultMessage = isBadResult(data);
                    if(resultMessage !== ''){
                        MySwal.showValidationMessage(resultMessage);
                    }else{
                        return data.data;
                    }
                }).catch(error => {
                    console.error(error);
                    MySwal.showValidationMessage(`Request failed: ${error}`);
                }).finally(() => {
                    setUserBeingProcessed(false);
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({icon:'success',title:'Utilisateur modifié'});
            }
        });
    }

    function handleDeleteUser(user){
        console.log('delete '+user.last_name);
    }

    return (
        <TableRow disabled={userBeingProcessed}>
            <TableCell>{user.last_name ?? ''}</TableCell>
            <TableCell>{user.first_name ?? ''}</TableCell>
            <TableCell>{user.service ? user.service.name : ''}</TableCell>
            <TableCell>{user.email ?? ''}</TableCell>
            <TableCell>{user.username ?? ''}</TableCell>
            <TableCell>{user.created_at ?? ''}</TableCell>
            <TableCell>
                <Icon title="Modifier l'utilisateur" onClick={handleUpdateUser.bind(this,user)} className="users-list-admin-btn main-color-text button-edit-user" name="edit"/>
                <Icon title="Supprimer l'utilisateur" onClick={handleDeleteUser.bind(this,user)} className="users-list-admin-btn button-delete-user" name="delete"/>
            </TableCell>
        </TableRow>
    );
}

RowUser.propTypes = {
    user:PropTypes.object,
    servicesOptions:PropTypes.array,
};