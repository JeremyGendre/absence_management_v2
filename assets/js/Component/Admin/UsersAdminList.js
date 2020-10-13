import React, {useContext, useEffect, useState} from "react";
import {
    Grid,
    Input, Pagination, Radio, Select, Tab,
    Table,
    TableBody,
    TableCell, TableFooter,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "semantic-ui-react";
import axios from "axios";
import {
    collectionOfSelectableObjects,
    getFirstItemsInList,
    getTotalPagesForPagination,
    removeFromArray
} from "../../utils/functions";
import './UsersAdminList.css';
import RowUser from "./RowUser";
import {editUserInList, editUserRoleInList, userIsAdmin} from "../../utils/user";
import {servicesToSelectable} from "../../utils/service";
import {isBadResult} from "../../utils/server";
import {THEME_VALUES, ThemeContext} from "../Context/Theme";
import Footer from "../Table/Footer";
import {MySwal,Swal} from '../../utils/MySwal';

const noServiceOption = { key: 0, value: 0, text: 'Tous les services' };

const initialState = {
    searchLoading: false,
    adminFilter: false,
    filteredService: noServiceOption.key,
    usersListDisplayed: [],
    usersListCanBeDisplayed: [],
    usersBeingProcessed: [],
    loadingUsers: true,
    usersListFull: [],
    services: [],
    roles: [],
    selectedRoles: [],
};

export default function UsersAdminList(props){
    const [searchLoading,setSearchLoading] = useState(initialState.searchLoading);
    const [loadingUsers,setLoadingUsers] = useState(initialState.loadingUsers);

    const [usersListFull,setUsersListFull] = useState(initialState.usersListFull);
    const [usersListDisplayed,setUsersListDisplayed] = useState(initialState.usersListDisplayed);
    const [usersListCanBeDisplayed,setUsersListCanBeDisplayed] = useState(initialState.usersListCanBeDisplayed);
    const [usersBeingProcessed,setUsersBeingProcessed] = useState(initialState.usersBeingProcessed);

    const [adminFilter,setAdminFilter] = useState(initialState.adminFilter);
    const [filteredService,setFilteredService] = useState(initialState.filteredService);
    const [services,setServices] = useState(initialState.services);
    const [roles,setRoles] = useState(initialState.roles);

    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const maxItemPerPage = 10;

    const theme = useContext(ThemeContext);

    let searching = setTimeout(() => {},100);

    useEffect(()=>{
        axios.get('/api/user/all').then(data => {
            setUsersListFull(data.data);
            setUsersListCanBeDisplayed(data.data);
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setLoadingUsers(false);
        });

        axios.get('/api/service/all').then((result)=>{
            let newServiceList = servicesToSelectable(result.data);
            newServiceList = [noServiceOption,...newServiceList];
            setServices(newServiceList);
        }).catch((error)=>{
            console.log(error);
        });

        axios.get('/api/role/all').then((result)=>{
            setRoles(result.data);
        }).catch((error)=>{
            console.log(error);
        });
    },[]);

    useEffect(() => {
        Paginate(activePage);
    },[usersListCanBeDisplayed]);

    function handleSearchChange(data){
        clearTimeout(searching);
        setAdminFilter(false);
        setFilteredService(noServiceOption.key);
        setSearchLoading(true);
        searching = setTimeout(function(){
            setActivePage(1);
            if(!data.value){
                setSearchLoading(false);
                setUsersListCanBeDisplayed(usersListFull);
                return;
            }
            setSearchLoading(false);
            setUsersListCanBeDisplayed(checkUserSearch(usersListFull,data.value));
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
                ).then(result => {
                    const errorMessage = isBadResult(result);
                    if(errorMessage !== ''){
                        Swal.showValidationMessage(`Request failed: ${errorMessage}`);
                    }else{
                        return result.data;
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
                setUsersListCanBeDisplayed(removeFromArray(user,usersListCanBeDisplayed));
                setUsersListFull(removeFromArray(user,usersListFull));
                MySwal.fire({icon:'success',title:'Utilisateur supprimé'});
            }
        });
    }

    function handleEditRoleUser(user){
        let selectedRoles = [];
        MySwal.fire({
            title: 'Modification des rôles pour '+user.last_name + ' ' + user.first_name,
            html:<Select id="roles-select"
                         options={collectionOfSelectableObjects(roles)}
                         defaultValue={user.roles}
                         onChange={(e,data) => {selectedRoles = data.value;}}
                         multiple/>,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Modifier',
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => {
                setUsersBeingProcessed([...usersBeingProcessed,user.id]);
                return axios.put(
                    '/api/user/edit/roles/' + user.id,{roles: selectedRoles}
                ).then(result => {
                    const errorMessage = isBadResult(result);
                    if(errorMessage !== ''){
                        Swal.showValidationMessage(`Request failed: ${errorMessage}`);
                    }else{
                        user.roles = result.data.roles;
                        setUsersListFull(editUserRoleInList(usersListFull,user.id,result.data.roles));
                        setUsersListCanBeDisplayed(editUserRoleInList(usersListCanBeDisplayed,user.id,result.data.roles));
                        return result.data;
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
                MySwal.fire({icon:'success',title:"Rôles de l'utilisateur modifiés"});
            }
        });
    }

    function handleToggleUserActivation(user){
        const userFullName = user.last_name + ' ' + user.first_name;
        const toggleAction = (user.isActive === true ? 'Désactiver' : 'Activer');
        MySwal.fire({
            title: toggleAction + ' ' + userFullName + ' ?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: toggleAction,
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => {
                setUsersBeingProcessed([...usersBeingProcessed,user.id]);
                return axios.put(
                    '/api/user/activation/' + user.id,{isActive: !user.isActive}
                ).then(result => {
                    const errorMessage = isBadResult(result);
                    if(errorMessage !== ''){
                        Swal.showValidationMessage(`Request failed: ${errorMessage}`);
                    }else{
                        user = result.data;
                        setUsersListFull(editUserInList(usersListFull,user));
                        setUsersListCanBeDisplayed(editUserInList(usersListCanBeDisplayed,user));
                        return user;
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
                MySwal.fire({icon:'success',title:"Utilisateur " + (user.isActive === true ? 'activé' : 'désactivé')});
            }
        });
    }

    function handleFilterByServiceChange(data){
        let newUserList = (data !== noServiceOption.key ? usersByService(usersListFull,data) : usersListFull);
        setFilteredService(data);
        setAdminFilter(false);
        setActivePage(1);
        setUsersListCanBeDisplayed(newUserList);
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

    function handleAdminFilterClick(){
        const newAdminFilterValue = !adminFilter;
        const newUserList = (newAdminFilterValue === true ? adminUsers(usersListFull) : usersListFull);
        setFilteredService(noServiceOption.key);
        setAdminFilter(newAdminFilterValue);
        setActivePage(1);
        setUsersListCanBeDisplayed(newUserList);
    }

    function adminUsers(users){
        let usersList = [];
        users.map(oneUser => {
            if(userIsAdmin(oneUser)){
                usersList.push(oneUser);
            }
        });
        return usersList;
    }

    function Paginate(newActivePage){
        const newTotalPages = getTotalPagesForPagination(usersListCanBeDisplayed,maxItemPerPage);
        const realNewActivePage = newTotalPages < newActivePage ? 1 : newActivePage;
        setTotalPages(newTotalPages);
        setActivePage(realNewActivePage);
        setUsersListDisplayed(getFirstItemsInList(usersListCanBeDisplayed,(newActivePage-1)*maxItemPerPage,maxItemPerPage));
    }

    return (
        <Tab.Pane className={theme.value === THEME_VALUES.dark ? 'inverted-tab-bg' : ''} inverted={theme.value === THEME_VALUES.dark} attached={false} loading={loadingUsers}>
            <Grid columns={3}>
                <Grid.Row>
                    <Grid.Column>
                        <Input className="float-right" icon="search" onChange={(e,data) => handleSearchChange(data)} loading={searchLoading} placeholder="Rechercher"/>
                    </Grid.Column>
                    <Grid.Column>
                        <Select placeholder="Tri sur un service" value={filteredService} onChange={(e,data) => handleFilterByServiceChange(data.value)} options={services}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Radio toggle label="Administrateurs" checked={adminFilter} onClick={handleAdminFilterClick}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <br/>
            <Table inverted={theme.value === THEME_VALUES.dark} selectable>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Status</TableHeaderCell>
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
                                handleEditRoleUser={handleEditRoleUser}
                                handleToggleUserActivation={handleToggleUserActivation}
                            />
                        );
                    })}
                </TableBody>
                <Footer activePage={activePage} totalPages={totalPages} Paginate={Paginate}/>
            </Table>
        </Tab.Pane>
    );
}