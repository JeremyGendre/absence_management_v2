import React, {useState} from "react";
import {Form, FormGroup, FormInput, Input, Message} from "semantic-ui-react";

export default function PasswordForm(props){
    const [password,setPassword] = useState(null);
    const [confirmPassword,setConfirmPassword] = useState(null);
    const [formErrors,setFormErrors] = useState([]);
    const [submitting,setSubmitting] = useState(false);

    function handlePasswordFormSubmit(){
        if(password !== confirmPassword){
            setFormErrors(['Les deux valeurs renseignées ne sont pas identiques, veuillez saisir le même mot de passe.']);
        }else{
            setSubmitting(true);
            setFormErrors([]);
            console.log('ouais re');
        }
    }

    function passwordFormErrors(){
        let errors = [];
        if(password !== confirmPassword){
            errors.push('Les deux valeurs renseignées ne sont pas identiques, veuillez saisir le même mot de passe.');
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
            <FormGroup>
                <Form.Field>
                    <label>Nouveau mot de passe :</label>
                    <Input icon="eye slash" defaultValue={password} autoComplete='off' required minLength={6} maxLength={100} onChange={(e,data)=>setPassword(data.value)} type="password" />
                </Form.Field>
            </FormGroup>
            <FormGroup>
                <Form.Field>
                    <label>Confirmer le nouveau mot de passe :</label>
                    <Input icon="eye slash" defaultValue={confirmPassword} autoComplete='off' required minLength={6} maxLength={100} onChange={(e,data)=>setConfirmPassword(data.value)} type="password" />
                </Form.Field>
            </FormGroup>
            <Form.Group>
                <Form.Button className="submit-button-container" primary disabled={submitting} loading={submitting}>Enregistrer</Form.Button>
            </Form.Group>
        </Form>
    );
}