import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Form, Message, Tab} from "semantic-ui-react";
import {servicesToSelectable} from "../../utils/service";
import {displayErrorPopup} from "../../utils/error";
import {isBadResult} from "../../utils/server";
import {THEME_VALUES, ThemeContext} from "../Context/Theme";
import {MySwal} from '../../utils/MySwal';

const initialUserState = {
    lastName: '',
    firstName: '',
    service: null,
    title: '',
    email: '',
    username: '',
    password: '',
};

export default function NewUser(props){
    const [newUser,setNewUser] = useState(initialUserState);
    const [submitting,setSubmitting] = useState(false);
    const [serviceLoading,setServiceLoading] = useState(true);
    const [services,setServices] = useState([]);
    const [formErrors,setFormErrors] = useState([]);

    const theme = useContext(ThemeContext);

    useEffect(()=>{
        axios.get('/api/service/all').then((result)=>{
            setServices(servicesToSelectable(result.data));
        }).catch((error)=>{
            console.log(error);
        }).finally(()=>{
            setServiceLoading(false);
        });
    },[]);

    function handleFormSubmit(){
        setSubmitting(true);
        let errors = validateForm();
        if(errors.length > 0){ // il y a une ou plusieurs erreurs dans le formulaire
            setFormErrors(errors);
            setSubmitting(false);
            return false;
        } else { // formulaire ok
            axios.post('/api/user/new',
                {
                    first_name: newUser.firstName,
                    last_name: newUser.lastName,
                    email: newUser.email,
                    service: newUser.service,
                    title: newUser.title,
                    username: newUser.username,
                    password: newUser.password
                }).then(result => {
                    const errorMessage = isBadResult(result);
                    if(errorMessage !== ''){
                        displayErrorPopup(errorMessage);
                    }else{
                        setNewUser(initialUserState);
                        MySwal.fire({
                            icon:'success',
                            title:'Utilisateur créé',
                        });
                    }
            }).catch( displayErrorPopup ).finally(() => {
                setFormErrors([]);
                setSubmitting(false);
            });
        }
    }

    function validateForm() {
        let allowServiceValues = [];
        services.forEach((one_service) => {
            allowServiceValues.push(one_service.value);
        });
        let errors = [];
        if(!newUser.lastName || newUser.lastName.length === 0){
            errors.push("Le nom de famille est obligatoire");
        }
        if(!newUser.firstName || newUser.firstName.length === 0){
            errors.push("Le prénom est obligatoire");
        }
        if(!newUser.username || newUser.username.length === 0){
            errors.push("Le nom d'utilisateur est obligatoire");
        }
        if(!newUser.password || newUser.password.length < 6){
            errors.push("Le mot de passe doit faire au moins 6 charactères");
        }
        if(!newUser.email || newUser.email.length < 3 || newUser.email.includes('@') === false){
            errors.push("L'adresse email n'est pas valide");
        }
        if(!newUser.service || !allowServiceValues.includes(newUser.service)){
            errors.push("Le service n'existe pas");
        }
        return errors;
    }

    return (
        <Tab.Pane className={theme.value === THEME_VALUES.dark ? 'inverted-tab-bg' : ''} inverted={theme.value === THEME_VALUES.dark} attached={false} loading={serviceLoading}>
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
                    <Form.Input fluid icon='user outline' iconPosition='left' label="Nom" required placeholder='Nom de famille' value={newUser.lastName} onChange={(e,data) => setNewUser({...newUser,lastName:data.value})} width={8}/>
                    <Form.Input fluid icon='user outline' iconPosition='left' label="Prénom" required placeholder='Prénom' value={newUser.firstName} onChange={(e,data) => setNewUser({...newUser,firstName:data.value})} width={8}/>
                    <Form.Input fluid icon='at' iconPosition='left' type="email" required label="Email" placeholder='Email' value={newUser.email} onChange={(e,data) => setNewUser({...newUser,email:data.value})} width={8}/>
                </Form.Group>
                <Form.Group>
                    <Form.Input fluid icon='user' iconPosition='left' label="Nom d'utilisateur" required
                                placeholder="Nom d'utilisateur" value={newUser.username}
                                onChange={(e,data) => setNewUser({...newUser,username:data.value})} width={6}/>
                    <Form.Input fluid icon='user secret' iconPosition='left' label="Mot de passe (provisoire)" required
                                placeholder='Mot de passe' type="password" minLength={6} maxLength={100}
                                value={newUser.password} onChange={(e,data) => setNewUser({...newUser,password:data.value})} width={6}/>
                </Form.Group>
                <Form.Group>
                    <Form.Select fluid label="Service" required options={services} onChange={(e,data) =>setNewUser({...newUser,service:data.value})} value={newUser.service} width={8}/>
                    <Form.Input fluid icon="id badge" iconPosition='left' label="Intitulé de poste" required
                                placeholder='Intitulé de poste' value={newUser.title} onChange={(e,data) => setNewUser({...newUser,title:data.value})} width={8}/>
                </Form.Group>
                <Form.Group>
                    <Form.Button className="submit-button-container" primary disabled={submitting} loading={submitting}>Enregistrer</Form.Button>
                </Form.Group>
            </Form>
        </Tab.Pane>
    );
}