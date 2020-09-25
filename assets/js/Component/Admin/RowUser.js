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
import {SessionContext, userHasRole} from "../Context/session";

const MySwal = withReactContent(Swal);

export default function RowUser(props){
    const [user,setUser] = useState({});

    const authUser = useContext(SessionContext);

    useEffect(()=>{
        setUser(props.user);
    },[props.user]);

    function handleDeleteUser(user){
        props.handleDelete(user);
    }

    return (
        <TableRow disabled={props.processed}>
            <TableCell>{user.last_name ?? ''}</TableCell>
            <TableCell>{user.first_name ?? ''}</TableCell>
            <TableCell>{user.service ? user.service.name : ''}</TableCell>
            <TableCell>{user.email ?? ''}</TableCell>
            <TableCell>{user.username ?? ''}</TableCell>
            <TableCell>{user.created_at ?? ''}</TableCell>
            <TableCell>
                {
                    (userHasRole(user,"ROLE_ADMIN") || authUser.user.id === user.id) ? (
                        <Icon title="Administrateur" name="user secret"/>
                    ) : (
                        <Icon title="Supprimer l'utilisateur" onClick={handleDeleteUser.bind(this,user)} className="users-list-admin-btn button-delete-user" name="trash"/>
                    )
                }
            </TableCell>
        </TableRow>
    );
}

RowUser.propTypes = {
    user:PropTypes.object,
    processed: PropTypes.bool,
    handleDelete: PropTypes.func
};