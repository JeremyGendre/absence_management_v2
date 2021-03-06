import React, {useContext, useEffect, useState} from "react";
import {
    Icon,
    Input, Tab,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "semantic-ui-react";
import axios from "axios";
import {getFirstItemsInList, getTotalPagesForPagination, removeFromArray} from "../../utils/functions";
import {STATUS_ASKED} from "../../utils/holidaysStatus";
import {convertListToAdminListFormat} from "../../utils/holidayFormat";
import {displayErrorPopup} from "../../utils/error";
import {isBadResult} from "../../utils/server";
import {THEME_VALUES, ThemeContext} from "../Context/Theme";
import Footer from "../Table/Footer";
import {MySwal,Swal} from '../../utils/MySwal';

export default function HolidaysAdminList(props){
    const [searchLoading,setSearchLoading] = useState(false);
    const [loadingHolidays,setLoadingHolidays] = useState(true);
    const [holidaysListFull,setHolidaysListFull] = useState([]);
    const [holidaysListDisplayed,setHolidaysListDisplayed] = useState([]);
    const [holidaysListCanBeDisplayed,setHolidaysListCanBeDisplayed] = useState([]);
    const [holidaysBeingProcessed,setHolidaysBeingProcessed] = useState([]);

    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const maxItemPerPage = 10;

    const theme = useContext(ThemeContext);

    let searching = setTimeout(() => {},100);

    useEffect(()=>{
        axios.get('/api/holiday/status/' + STATUS_ASKED).then(data => {
            let convertedHolidays = convertListToAdminListFormat(data.data);
            setHolidaysListFull(convertedHolidays);
            setHolidaysListCanBeDisplayed(convertedHolidays);
        }).catch( displayErrorPopup ).finally(()=>{
            setLoadingHolidays(false);
        });
    },[]);

    useEffect(() =>{
        Paginate(activePage);
    },[holidaysListCanBeDisplayed]);

    function handleAcceptClick(holiday){
        MySwal.fire({
            title: 'Accepter cette demande ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, accepter',
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => {
                setHolidaysBeingProcessed([...holidaysBeingProcessed,holiday.key]);
                return axios.put(
                    '/api/holiday/accept/' + holiday.key
                ).then(result => {
                    const errorMessage = isBadResult(result);
                    if(errorMessage !== ''){
                        Swal.showValidationMessage(`Request failed: ${errorMessage}`);
                    }else{
                        setHolidaysListFull(removeFromArray(holiday,holidaysListFull));
                        setHolidaysListCanBeDisplayed(removeFromArray(holiday,holidaysListCanBeDisplayed));
                        return result.data;
                    }
                }).catch(error => {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                });
            }
        }).then((result) => {
            if(result.isConfirmed){
                MySwal.fire({icon:'success',title:'Demande acceptée'});
            }
        }).finally(()=>{
            setHolidaysBeingProcessed(removeFromArray(holiday.key,holidaysBeingProcessed));
        });
    }

    function handleRefuseClick(holiday){
        MySwal.fire({
            title: 'Refuser cette demande ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, refuser',
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => {
                setHolidaysBeingProcessed([...holidaysBeingProcessed,holiday.key]);
                return axios.put(
                    '/api/holiday/reject/' + holiday.key
                ).then(result => {
                    const errorMessage = isBadResult(result);
                    if(errorMessage !== ''){
                        Swal.showValidationMessage(`Request failed: ${errorMessage}`);
                    }else{
                        setHolidaysListFull(removeFromArray(holiday,holidaysListFull));
                        setHolidaysListCanBeDisplayed(removeFromArray(holiday,holidaysListCanBeDisplayed));
                        return result.data;
                    }
                }).catch(error => {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                });
            }
        }).then((result) => {
            if(result.isConfirmed){
                MySwal.fire({icon:'success',title:'Demande refusée'});
            }
        }).finally(()=>{
            setHolidaysBeingProcessed(removeFromArray(holiday.key,holidaysBeingProcessed));
        });
    }

    function handleSearchChange(data){
        clearTimeout(searching);
        setSearchLoading(true);
        searching = setTimeout(function(){
            setActivePage(1);
            if(!data.value){
                setSearchLoading(false);
                setHolidaysListCanBeDisplayed(holidaysListFull);
                return;
            }
            setSearchLoading(false);
            setHolidaysListCanBeDisplayed(checkHolidaySearch(holidaysListFull,data.value));
        },300);
    }

    function checkHolidaySearch(holidays, value){
        let result = [];
        holidays.forEach((holiday) => {
            if(holiday.person.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || holiday.service.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || holiday.start.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || holiday.end.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || holiday.duration === parseInt(value)){
                result.push(holiday);
            }
        });
        return result;
    }

    function Paginate(newActivePage){
        const newTotalPages = getTotalPagesForPagination(holidaysListCanBeDisplayed,maxItemPerPage);
        const realNewActivePage = newTotalPages < newActivePage ? 1 : newActivePage;
        setTotalPages(newTotalPages);
        setActivePage(realNewActivePage);
        setHolidaysListDisplayed(getFirstItemsInList(holidaysListCanBeDisplayed,(realNewActivePage-1)*maxItemPerPage,maxItemPerPage));
    }

    return (
        <Tab.Pane className={theme.value === THEME_VALUES.dark ? 'inverted-tab-bg' : ''} inverted={theme.value === THEME_VALUES.dark} attached={false} loading={loadingHolidays}>
            <Input className="float-right" icon="search" onChange={(e,data) => handleSearchChange(data)} loading={searchLoading} placeholder="Rechercher"/><br/><br/>
            <Table inverted={theme.value === THEME_VALUES.dark} selectable>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Personne</TableHeaderCell>
                        <TableHeaderCell>Service</TableHeaderCell>
                        <TableHeaderCell>Début</TableHeaderCell>
                        <TableHeaderCell>Fin</TableHeaderCell>
                        <TableHeaderCell>Durée (j)</TableHeaderCell>
                        <TableHeaderCell> </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {holidaysListDisplayed.length === 0 && (
                        <TableRow key={0}>
                            <TableCell/>
                            <TableCell/>
                            <TableCell>Aucunes données</TableCell>
                            <TableCell/>
                            <TableCell/>
                            <TableCell/>
                        </TableRow>
                    )}
                    {holidaysListDisplayed.length !== 0 && holidaysListDisplayed.map((data) => {
                        return(
                            <TableRow key={data.key} disabled={holidaysBeingProcessed.includes(data.key)}>
                                <TableCell>{data.person}</TableCell>
                                <TableCell>{data.service}</TableCell>
                                <TableCell>{data.start}</TableCell>
                                <TableCell>{data.end}</TableCell>
                                <TableCell>{data.duration}</TableCell>
                                <TableCell>
                                    <Icon name="check" className="admin-list-icons status-accepted" onClick={handleAcceptClick.bind(this,data)} title="Accepter"/>
                                    <Icon name="close" className="admin-list-icons status-close" onClick={handleRefuseClick.bind(this,data)} title="Refuser"/>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <Footer activePage={activePage} totalPages={totalPages} Paginate={Paginate}/>
            </Table>
        </Tab.Pane>
    );
}