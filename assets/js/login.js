import {docReady} from "./main";

docReady(function() {
    console.log('ouais re');
    let form = document.getElementById('login-form');
    form.addEventListener('submit',function(){
        document.getElementById('button-login-submit').innerText = 'Connexion...';
    })
});