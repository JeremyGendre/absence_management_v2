import React, {useContext, useEffect, useState} from "react";
import {
    Icon,
    TableCell,
    TableRow
} from "semantic-ui-react";
import axios from "axios";
import {removeFromArray} from "../../utils/functions";
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './UsersAdminList.css';
import {isBadResult} from "../../utils/server";

const MySwal = withReactContent(Swal);

export default function RowUser(props){
    const [user,setUser] = useState({});
    const [userBeingProcessed,setUserBeingProcessed] = useState(false);

    useEffect(()=>{
        setUser(props.user);
    },[props.user]);

    function handleDeleteUser(user){
        setUserBeingProcessed(true);
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
                <Icon title="Supprimer l'utilisateur" onClick={handleDeleteUser.bind(this,user)} className="users-list-admin-btn button-delete-user" name="delete"/>
            </TableCell>
        </TableRow>
    );
}

RowUser.propTypes = {
    user:PropTypes.object
};