import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {isBadResult} from "../../utils/server";
import {displayErrorPopup} from "../../utils/error";
import {Form, FormField, Message} from "semantic-ui-react";
import {SessionContext} from "../Context/session";
import PropTypes from 'prop-types';
import SemanticDatepicker from "react-semantic-ui-datepickers";
import {MySwal} from "../../utils/MySwal";

export default function NewFixedHoliday(props){
    const [newFixedHolidayDay,setNewFixedHolidayDay] = useState(null);
    const [submitting,setSubmitting] = useState(false);
    const [formErrors,setFormErrors] = useState([]);

    const userInfos = useContext(SessionContext);

    useEffect(()=>{
        console.log(newFixedHolidayDay);
    },[newFixedHolidayDay])

    function handleFormSubmit(){
        setSubmitting(true);
        let errors = validateForm();
        if(errors.length > 0){ // il y a une ou plusieurs erreurs dans le formulaire
            setFormErrors(errors);
            setSubmitting(false);
            return false;
        } else { // formulaire ok
            axios.post(
                '/api/fixed/holiday/' + userInfos.user.id + '/new',
                {day: newFixedHolidayDay}
            ).then(result => {
                const errorMessage = isBadResult(result);
                if(errorMessage !== ''){
                    displayErrorPopup(errorMessage);
                }else{
                    props.addFixedHoliday(result.data);
                    MySwal.fire({icon:'success', title:'Jour férié créé',});
                }
            }).catch(error => {
                console.log(error);
                displayErrorPopup(error);
            }).finally(() => {
                setFormErrors([]);
                setSubmitting(false);
                setNewFixedHolidayDay(null);
            });
        }
    }

    function validateForm() {
        let errors = [];
        if(!newFixedHolidayDay || !(newFixedHolidayDay instanceof Date)){
            errors.push("Le jour est obligatoire");
        }
        return errors;
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
            <Form.Group widths='equal'>
                <FormField>
                    <label>Jour <span className="form-required-star">*</span></label>
                    <SemanticDatepicker icon='calendar' required name="new_fixed_day_date" locale="fr-FR" value={newFixedHolidayDay} format="DD/MM/YYYY" onChange={(e,data) => setNewFixedHolidayDay(data.value)}/>
                </FormField>
            </Form.Group>
            <Form.Group>
                <Form.Button className="submit-button-container" primary disabled={submitting} loading={submitting}>Enregistrer</Form.Button>
            </Form.Group>
        </Form>
    );
}

NewFixedHoliday.propTypes = {
    addFixedHoliday: PropTypes.func.isRequired
}