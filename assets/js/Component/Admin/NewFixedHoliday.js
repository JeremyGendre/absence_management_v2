import React, {useEffect, useState} from 'react';
import axios from "axios";
import {isBadResult} from "../../utils/server";
import {displayErrorPopup} from "../../utils/error";
import {Form, FormField, Message} from "semantic-ui-react";
import PropTypes from 'prop-types';
import {MySwal} from "../../utils/MySwal";
import {objectToSelectable} from "../../utils/functions";
import {getMonthName, getMonthNumberDays} from "../../utils/date";

export default function NewFixedHoliday(props){
    const [newDay,setNewDay] = useState(1);
    const [newMonth,setNewMonth] = useState(1);
    const [submitting,setSubmitting] = useState(false);
    const [formErrors,setFormErrors] = useState([]);

    const maxNumberOfDays = getMonthNumberDays(newMonth-1);

    useEffect(()=>{
        if(newDay > maxNumberOfDays){
            setNewDay(maxNumberOfDays);
        }
    },[newMonth]);

    function handleFormSubmit(){
        setSubmitting(true);
        let errors = validateForm();
        if(errors.length > 0){ // il y a une ou plusieurs erreurs dans le formulaire
            setFormErrors(errors);
            setSubmitting(false);
            return false;
        } else { // formulaire ok
            axios.post(
                '/api/fixed/holiday/new',
                {day: newDay,month:newMonth}
            ).then(result => {
                const errorMessage = isBadResult(result);
                if(errorMessage !== ''){
                    displayErrorPopup(errorMessage);
                }else{
                    props.addFixedHoliday(result.data);
                    MySwal.fire({icon:'success', title:'Jour férié créé',});
                }
            }).catch( displayErrorPopup ).finally(() => {
                setFormErrors([]);
                setSubmitting(false);
                setNewDay(1);
                setNewMonth(1);
            });
        }
    }

    function validateForm() {
        let errors = [];
        if(!newDay || !(newDay > 0 && newDay <= 31)){
            errors.push("Le jour est invalide");
        }
        if(!newMonth || !(newMonth > 0 && newMonth <= 12)){
            errors.push("Le mois est invalide");
        }
        return errors;
    }

    const daysPossible = [];
    for(let i = 1; i <= maxNumberOfDays; i++){
        daysPossible.push(objectToSelectable(i,i,i));
    }

    const monthsPossible = [];
    for(let i = 1; i < 13; i++){
        monthsPossible.push(objectToSelectable(i,i,i + ' - ' +getMonthName(i-1)));
    }

    return (
        <Form onSubmit={handleFormSubmit}>
            <h2>Créer un nouveau jour férié</h2>
            {(formErrors.length > 0) ? (
                <Message negative>
                    {
                        formErrors.map((error,index) => {
                            return (
                                <p key={index}>{error}</p>
                            );
                        })
                    }
                </Message>
            ) : (
                <></>
            )}
            <Form.Group>
                <FormField width={4}>
                    <label>Jour <span className="form-required-star">*</span></label>
                    <Form.Select fluid required options={daysPossible} onChange={(e,{value}) =>setNewDay(value)} value={newDay}/>
                </FormField>
                <FormField width={6}>
                    <label>Mois <span className="form-required-star">*</span></label>
                    <Form.Select fluid required options={monthsPossible} onChange={(e,{value}) =>setNewMonth(value)} value={newMonth}/>
                </FormField>
            </Form.Group>
            <Form.Group>
                <Form.Button className="submit-button-container d-flex new-fixed-holiday-submit" primary disabled={submitting} loading={submitting}>Enregistrer</Form.Button>
            </Form.Group>
        </Form>
    );
}

NewFixedHoliday.propTypes = {
    addFixedHoliday: PropTypes.func.isRequired
};