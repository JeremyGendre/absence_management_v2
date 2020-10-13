import React, {useContext, useState} from "react";
import {Form, FormGroup, Input, Message} from "semantic-ui-react";
import axios from 'axios';
import {SessionContext} from "../Context/session";
import {isBadResult} from "../../utils/server";
import {displayErrorPopup} from "../../utils/error";
import {MySwal} from '../../utils/MySwal';

export default function PasswordForm(props){
    const [oldPassword,setOldPassword] = useState(null);
    const [password,setPassword] = useState(null);
    const [confirmPassword,setConfirmPassword] = useState(null);
    const [formErrors,setFormErrors] = useState([]);
    const [submitting,setSubmitting] = useState(false);

    const user = useContext(SessionContext);

    function handlePasswordFormSubmit(){
        let errors = passwordFormErrors();
        if(errors.length > 0){
            setFormErrors(errors);
        }else{
            setSubmitting(true);
            setFormErrors([]);
            axios.put('/api/user/edit/password/'+user.user.id,{oldPassword:oldPassword,password:password}).then(result => {
                const errorMessage = isBadResult(result);
                if(errorMessage !== ''){
                    displayErrorPopup(errorMessage);
                }else{
                    MySwal.fire({icon:'success',title:'Mot de passe modifié'});
                    setOldPassword('');
                    setPassword('');
                    setConfirmPassword('');
                }
            }).catch(error => {
                console.error(error);
                setFormErrors(['Une erreur est survenue : ' + error.message]);
            }).finally(()=>{
                setSubmitting(false);
            });
        }
    }

    function passwordFormErrors(){
        let errors = [];
        if(password !== confirmPassword){
            errors.push('Les deux valeurs renseignées (du nouveau mot de passe) ne sont pas identiques.');
        }else{
            if(password.length < 6){
                errors.push('Le mot de passe doit contenir plus de 6 charactères.');
            } else if(password.length > 100){
                errors.push('Le mot de passe doit contenir moins de 100 charactères.');
            }
        }
        return errors;
    }

    return (
        <Form onSubmit={handlePasswordFormSubmit}>
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
            <FormGroup>
                <Form.Field>
                    <label>Ancien mot de passe :</label>
                    <Input icon="eye slash" value={oldPassword} autoComplete='off' required minLength={6} maxLength={100} onChange={(e,data)=>setOldPassword(data.value)} type="password" />
                </Form.Field>
            </FormGroup>
            <hr className="hr-custom"/><br/>
            <FormGroup>
                <Form.Field>
                    <label>Nouveau mot de passe :</label>
                    <Input icon="eye slash" value={password} autoComplete='off' required minLength={6} maxLength={100} onChange={(e,data)=>setPassword(data.value)} type="password" />
                </Form.Field>
            </FormGroup>
            <FormGroup>
                <Form.Field>
                    <label>Confirmer le nouveau mot de passe :</label>
                    <Input icon="eye slash" value={confirmPassword} autoComplete='off' required minLength={6} maxLength={100} onChange={(e,data)=>setConfirmPassword(data.value)} type="password" />
                </Form.Field>
            </FormGroup>
            <Form.Group>
                <Form.Button className="submit-button-container" primary disabled={submitting} loading={submitting}>Enregistrer</Form.Button>
            </Form.Group>
        </Form>
    );
}