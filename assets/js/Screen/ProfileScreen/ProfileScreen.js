import React, {useContext, useEffect, useState} from "react";
import {
    Container,
    Header as SemanticHeader,
    Form,
    Message
} from 'semantic-ui-react';
import './ProfileScreen.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {SessionContext} from "../../Component/Context/session";
import {isBadResult} from "../../utils/server";
import axios from 'axios';
import MyLoader from "../../Component/MyLoader/MyLoader";

const MySwal = withReactContent(Swal);

export default function ProfileScreen(props){
    const [lastName,setLastName] = useState(null);
    const [firstName,setFirstName] = useState(null);
    const [service,setService] = useState(0);
    const [title,setTitle] = useState(null);
    const [email,setEmail] = useState(null);
    const [submitting,setSubmitting] = useState(false);
    const [formErrors,setFormErrors] = useState([]);
    const [serviceOptions,setServiceOptions] = useState([
        {
            key:0,
            value:0,
            text:'Aucune entrée'
        }
    ]);
    const [loadingData,setLoadingData] = useState(true);

    const user = useContext(SessionContext);

    useEffect(()=>{
        axios.get('/api/service/all').then((result)=>{
            if(isBadResult(result) === ''){
                let services = result.data;
                let newServiceList = [];
                services.forEach(service => {
                    newServiceList.push({
                        key:service.id,
                        value:service.id,
                        text:service.name
                    });
                });
                setLastName(user.user.last_name);
                setFirstName(user.user.first_name);
                setService(user.user.service.id);
                setTitle(user.user.title);
                setEmail(user.user.email);
                setLoadingData(false);
                setServiceOptions(newServiceList);
            }
        }).catch((error)=>{
            setLoadingData(false);
            console.log(error);
        });
    },[])

    function handleFormSubmit(){
        setSubmitting(true);
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
        if(errors.length > 0){ // il y a une ou plusieurs erreurs dans le formulaire
            setFormErrors(errors);
            setSubmitting(false);
            return false;
        } else { // formulaire ok
            axios.put(
                '/api/user/edit/'+user.user.id,
                {
                    first_name:firstName,
                    last_name:lastName,
                    email:email,
                    service:service,
                    title:title,
                    username:user.user.username
                }).then(result => {
                let messageResult = isBadResult(result);
                if(messageResult !== ''){
                    MySwal.fire({
                        icon:'error',
                        title: messageResult,
                    });
                }else{
                    let userData = result.data;
                    user.updateUser(userData);
                    MySwal.fire({
                        icon:'success',
                        title:'Profil mis à jour',
                    });
                }
                setFormErrors([]);
                setSubmitting(false);
            }).catch(error => {
                console.log(error);
                MySwal.fire({
                    icon:'error',
                    title:'Une erreur est survenue. Mise à jour impossible',
                });
                setFormErrors([]);
                setSubmitting(false);
            });
        }
    }

    return(
        <>
            {loadingData ? (
                <MyLoader size="big"/>
            ) : (
                <Container className="profile-container custom-containers">
                    <SemanticHeader as='h1'>Mon Profil</SemanticHeader>
                    <Form onSubmit={handleFormSubmit}>
                        {(formErrors.length > 0) ? (
                            <Message negative>
                                {
                                    formErrors.map((error) => {
                                        return (
                                            <p>{error}</p>
                                        );
                                    })
                                }
                            </Message>
                        ) : (
                            <></>
                        )}

                        <Form.Group>
                            <Form.Input fluid label="Nom" required placeholder='Nom de famille' defaultValue={lastName} onChange={(e,data) => setLastName(data.value)} width={8}/>
                            <Form.Input fluid label="Prénom" required placeholder='Prénom' defaultValue={firstName} onChange={(e,data) => setFirstName(data.value)} width={8}/>
                            <Form.Input fluid type="email" required label="Email" placeholder='Email' defaultValue={email} onChange={(e,data) => setEmail(data.value)} width={8}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Select fluid label="Service" required options={serviceOptions} onChange={(e,data) => setService(data.value)} value={service} width={8}/>
                            <Form.Input fluid label="Intitulé de poste" required placeholder='Intitulé de poste' onChange={(e,data) => setTitle(data.value)} defaultValue={title} width={8}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Button className="submit-button-container" color='teal' loading={submitting}>Enregistrer</Form.Button>
                        </Form.Group>
                    </Form>
                </Container>
            )}
        </>
    );
}