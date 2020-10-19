import React, { useState} from "react";
import axios from "axios";
import {Form, Message} from "semantic-ui-react";
import PropTypes from 'prop-types';
import {displayErrorPopup} from "../../utils/error";
import {isBadResult} from "../../utils/server";
import {MySwal} from "../../utils/MySwal";

export default function NewService(props){
    const [newServiceName,setNewServiceName] = useState('');
    const [submitting,setSubmitting] = useState(false);
    const [formErrors,setFormErrors] = useState([]);

    function handleFormSubmit(){
        setSubmitting(true);
        let errors = validateForm();
        if(errors.length > 0){ // il y a une ou plusieurs erreurs dans le formulaire
            setFormErrors(errors);
            setSubmitting(false);
            return false;
        } else { // formulaire ok
            axios.post(
                '/api/service/new',
                {name: newServiceName}
            ).then(result => {
                const errorMessage = isBadResult(result);
                if(errorMessage !== ''){
                    displayErrorPopup(errorMessage);
                }else{
                    props.addService(result.data);
                    MySwal.fire({
                        icon:'success',
                        title:'Service créé',
                    });
                }
            }).catch( displayErrorPopup ).finally(() => {
                setFormErrors([]);
                setSubmitting(false);
                setNewServiceName('');
            });
        }
    }

    function validateForm() {
        let errors = [];
        if(!newServiceName || newServiceName.length === 0){
            errors.push("Le nom est obligatoire");
        }
        return errors;
    }

    return (
        <Form onSubmit={handleFormSubmit}>
            <h2>Créer un nouveau service</h2>
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
                <Form.Input fluid icon='file alternate outline' iconPosition='left' required label="Nom" placeholder='Nom' value={newServiceName} onChange={(e,data) => setNewServiceName(data.value)}/>
            </Form.Group>
            <Form.Group>
                <Form.Button className="submit-button-container" primary disabled={submitting} loading={submitting}>Enregistrer</Form.Button>
            </Form.Group>
        </Form>
    );
}

NewService.propTypes = {
    addService: PropTypes.func.isRequired
};