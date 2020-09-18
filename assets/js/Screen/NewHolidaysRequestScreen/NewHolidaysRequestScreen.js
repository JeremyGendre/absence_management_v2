import React, {useContext, useState} from "react";
import {
    Container,
    Header as SemanticHeader,
    Form, FormGroup, FormSelect, FormButton, FormField, FormTextArea,
    Message
} from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import './NewHolidaysRequestScreen.css';
import {TYPE_AM, TYPE_CP, TYPE_CT, TYPES_LABEL} from "../../utils/holidaysTypes";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {isBadResult} from "../../utils/server";
import axios from 'axios';
import {SessionContext} from "../../Component/Context/session";
import {isSameDay} from "../../utils/date";

const MySwal = withReactContent(Swal);

const types = [
    {
        key:1,
        text:TYPES_LABEL.TYPE_CP.long,
        value:TYPE_CP
    },
    {
        key:2,
        text:TYPES_LABEL.TYPE_CT.long,
        value:TYPE_CT
    },
    {
        key:3,
        text:TYPES_LABEL.TYPE_AM.long,
        value:TYPE_AM
    },
];

const oneDayPeriodOptions = [
    {
        key:1,
        text:'Matin',
        value:'Matin'
    },
    {
        key:2,
        text:'Après-midi',
        value:'Après-midi'
    },
    {
        key:3,
        text:'Journée entière',
        value:'Journée entière'
    },
];

const newDate = new Date();

const initialState = {
    startDate : newDate,
    endDate : newDate,
    canBeOnOneDay : true,
    oneDayType:'Journée entière',
    cause:'',
    type:null,
    submitting:false,
    formErrors : []
};

export default function NewHolidaysRequestScreen(props){
    const [startDate, setStartDate] = useState(initialState.startDate);
    const [endDate, setEndDate] = useState(initialState.endDate);
    const [canBeOnOneDay, setCanBeOnOneDay] = useState(initialState.canBeOnOneDay);
    const [oneDayType, setOneDayType] = useState(initialState.oneDayType);
    const [cause, setCause] = useState(initialState.cause);
    const [type, setType] = useState(initialState.type);
    const [submitting, setSubmitting] = useState(initialState.submitting);
    const [formErrors, setFormErrors] = useState(initialState.formErrors);

    const user = useContext(SessionContext);

    function handleStartDateChange(e,data){
        let newDate = data.value;
        setStartDate(newDate);
        setCanBeOnOneDay(isSameDay(newDate,endDate));
    }

    function handleEndDateChange(e,data){
        let newDate = data.value;
        setEndDate(newDate);
        setCanBeOnOneDay(isSameDay(newDate,startDate));
    }

    function backToInitialState(){
        setStartDate(initialState.startDate);
        setEndDate(initialState.endDate);
        setCanBeOnOneDay(initialState.canBeOnOneDay);
        setOneDayType(initialState.oneDayType);
        setCause(initialState.cause);
        setType(initialState.type);
        setSubmitting(initialState.submitting);
        setFormErrors(initialState.formErrors);
    }

    function handleFormSubmit(){
        setSubmitting(true);
        let errors = [];
        if(type === null){
            errors.push("Le type doit être renseigné");
        }
        if(Date.parse(startDate) > Date.parse(endDate)){
            errors.push("La date de début ne peut pas être plus récente que la date de fin.");
        }

        if(errors.length > 0){ // Il y a une ou plusieurs erreurs dans le formulaire
            setSubmitting(false);
            setFormErrors(errors);
            return false;
        }

        let oneDayTypeVar = null;
        if(canBeOnOneDay){
            oneDayTypeVar = oneDayType;
        }
        axios.post('/api/holiday/new/user/'+user.user.id,{
            start_date:startDate,
            end_date:endDate,
            type:type,
            period_type:oneDayTypeVar,
            status:null,
            cause:cause
        }).then(result => {
            let messageResult = isBadResult(result);
            if(messageResult !== ''){//erreur
                MySwal.fire({icon:'error',title:messageResult});
            }else{//ok
                MySwal.fire({icon:'success', title:'Demande créée',});
                backToInitialState();
            }
        }).catch(error => {//erreur
            MySwal.fire({icon:'error',title:'Une erreur est survenue. Création impossible.'});
            console.log(error);
        });
    }

    return(
        <Container className="custom-containers">
            <SemanticHeader as='h1'>Nouvelle demande</SemanticHeader>
            <Form onSubmit={handleFormSubmit}>
                {(formErrors.length === 0) ? (
                    <></>
                ) : (
                    <Message negative>
                        {formErrors.map((error) => {
                            return (
                                <p>{error}</p>
                            );
                        })}
                    </Message>
                )}
                <FormGroup>
                    <FormField>
                        <label>Date de début <span className="form-required-star">*</span></label>
                        <SemanticDatepicker required name="start_date" locale="fr-FR" value={startDate} format="DD/MM/YYYY" onChange={(e,data) => handleStartDateChange(e,data)}/>
                    </FormField>
                    <FormField>
                        <label>Date de fin <span className="form-required-star">*</span></label>
                        <SemanticDatepicker required name="start_end" locale="fr-FR" value={endDate} format="DD/MM/YYYY" onChange={(e,data) => handleEndDateChange(e,data)}/>
                    </FormField>
                    { (canBeOnOneDay) ? (
                        <FormSelect label="Type de période" options={oneDayPeriodOptions} onChange={(e,data) => setOneDayType(data.value)} defaultValue={'Journée entière'}/>
                    ):(
                        <></>
                    )}
                </FormGroup>
                <FormGroup>
                    <FormSelect label="Type de congés" required options={types} onChange={(e,data) => setType(data.value)}/>
                </FormGroup>
                <FormGroup>
                    <FormTextArea label="Cause" width={9} placeholder="Cause éventuelle" onChange={(e,data) => setCause(data.value)}/>
                </FormGroup>
                <FormGroup>
                    { submitting ? (
                        <FormButton className="submit-button-container" color="teal" loading>Valider</FormButton>
                    ) : (
                        <FormButton className="submit-button-container" color="teal">Valider</FormButton>
                    )}
                </FormGroup>
            </Form>
        </Container>
    );
}