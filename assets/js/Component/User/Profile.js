import React, {useState} from "react";
import axios from "axios";
import {Form, Message} from "semantic-ui-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PropTypes from 'prop-types';

const MySwal = withReactContent(Swal);

export default function Profile(props){
    const serviceOptions = props.services;
    const user = props.user;

    const [lastName,setLastName] = useState(user.user.last_name);
    const [firstName,setFirstName] = useState(user.user.first_name);
    const [service,setService] = useState(user.user.service.id);
    const [title,setTitle] = useState(user.user.title);
    const [email,setEmail] = useState(user.user.email);
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
            axios.put('/api/user/edit/'+user.user.id,
                {
                    first_name:firstName,
                    last_name:lastName,
                    email:email,
                    service:service,
                    title:title,
                    username:user.user.username
                }).then(result => {
                let userData = result.data;
                user.updateUser(userData);
                MySwal.fire({
                    icon:'success',
                    title:'Profil mis à jour',
                });
            }).catch(error => {
                console.log(error);
                MySwal.fire({icon:'error', title:'Une erreur est survenue : ' + error.message});
            }).finally(() => {
                setFormErrors([]);
                setSubmitting(false);
            });
        }
    }

    function validateForm() {
        let allowServiceValues = [];
        serviceOptions.forEach((one_service) => {
            allowServiceValues.push(one_service.value);
        });
        let errors = [];
        if(!lastName || lastName.length === 0){
            errors.push("Le nom de famille est obligatoire");
        }
        if(!firstName || firstName.length === 0){
            errors.push("Le prénom est obligatoire");
        }
        if(!email || email.length < 3 || email.includes('@') === false){
            errors.push("L'adresse email n'est pas valide");
        }
        if(!service || !allowServiceValues.includes(service)){
            errors.push("Vous devez faire partie d'un service existant.");
        }
        return errors;
    }

    return (
        <Form onSubmit={handleFormSubmit}>
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
                <Form.Input fluid icon='user outline' iconPosition='left' label="Nom" required placeholder='Nom de famille' defaultValue={lastName} onChange={(e,data) => setLastName(data.value)} width={8}/>
                <Form.Input fluid icon='user outline' iconPosition='left' label="Prénom" required placeholder='Prénom' defaultValue={firstName} onChange={(e,data) => setFirstName(data.value)} width={8}/>
                <Form.Input fluid icon='at' iconPosition='left' type="email" required label="Email" placeholder='Email' defaultValue={email} onChange={(e,data) => setEmail(data.value)} width={8}/>
            </Form.Group>
            <Form.Group>
                <Form.Select fluid label="Service" required options={serviceOptions} onChange={(e,data) => setService(data.value)} value={service} width={8}/>
                <Form.Input fluid icon="id badge" iconPosition='left' label="Intitulé de poste" required placeholder='Intitulé de poste' onChange={(e,data) => setTitle(data.value)} defaultValue={title} width={8}/>
            </Form.Group>
            <Form.Group>
                <Form.Button className="submit-button-container" primary disabled={submitting} loading={submitting}>Enregistrer</Form.Button>
            </Form.Group>
        </Form>
    );
}

Profile.propTypes = {
    user:PropTypes.object,
    services:PropTypes.array
};