import React, {useContext, useEffect, useState} from "react";
import {
    Icon,
    TableCell,
    TableRow
} from "semantic-ui-react";
import PropTypes from 'prop-types';
import './UsersAdminList.css';
import {SessionContext} from "../Context/session";
import {userIsAdmin} from "../../utils/user";

export default function RowUser(props){
    const [user,setUser] = useState({});

    const authUser = useContext(SessionContext);

    useEffect(()=>{
        setUser(props.user);
    },[props.user]);

    function handleDeleteUser(user){
        props.handleDelete(user);
    }

    function handleEditRoleUser(user){
        props.handleEditRoleUser(user);
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
                    (userIsAdmin(user) || authUser.user.id === user.id) ? (
                        <Icon title="Administrateur" name="user secret"/>
                    ) : (
                        <>
                            <Icon title="Modifier les droits" onClick={handleEditRoleUser.bind(this,user)} className="users-list-admin-btn button-edit-user-roles" name="unlock alternate"/>
                            <Icon title="Supprimer l'utilisateur" onClick={handleDeleteUser.bind(this,user)} className="users-list-admin-btn button-delete-user" name="trash"/>
                        </>
                    )
                }
            </TableCell>
        </TableRow>
    );
}

RowUser.propTypes = {
    user:PropTypes.object,
    processed: PropTypes.bool,
    handleDelete: PropTypes.func,
    handleEditRoleUser: PropTypes.func
};