import React, {useContext, useEffect, useState} from "react";
import {
    Icon, Label,
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

    function handleToggleUserActivation(user){
        props.handleToggleUserActivation(user);
    }

    return (
        <TableRow disabled={props.processed}>
            <TableCell>
                {userIsAdmin(user) ? <Label color="orange" ribbon>Administrateur</Label> : <Label ribbon>Utilisateur</Label>}
            </TableCell>
            <TableCell>
                {user.last_name ?? ''}
            </TableCell>
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
                            <Icon title="Modifier les droits" onClick={handleEditRoleUser.bind(this,user)}
                                  className="users-list-admin-btn button-edit-user-roles" name="unlock alternate"/>
                            <Icon title={(user.isActive ? "Désactiver" : "Activer") + " l'utilisateur"} onClick={handleToggleUserActivation.bind(this,user)}
                                  className={"users-list-admin-btn " + (user.isActive ? "button-deactivate-user" : "button-activate-user")} name="shutdown"/>
                            <Icon title="Supprimer l'utilisateur" onClick={handleDeleteUser.bind(this,user)}
                                  className="users-list-admin-btn button-delete-user" name="trash"/>
                        </>
                    )
                }
            </TableCell>
        </TableRow>
    );
}

RowUser.propTypes = {
    user:PropTypes.object.isRequired,
    processed: PropTypes.bool.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleEditRoleUser: PropTypes.func.isRequired,
    handleToggleUserActivation: PropTypes.func.isRequired
};