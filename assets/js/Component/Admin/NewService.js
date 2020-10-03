import React, { useState} from "react";
import axios from "axios";
import {Form, Message} from "semantic-ui-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PropTypes from 'prop-types';

const MySwal = withReactContent(Swal);

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
                props.addService(result.data);
                MySwal.fire({
                    icon:'success',
                    title:'Service créé',
                });
            }).catch(error => {
                console.log(error);
                MySwal.fire({icon:'error', title:'Une erreur est survenue : ' + error.message});
            }).finally(() => {
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
    addService: PropTypes.func
};