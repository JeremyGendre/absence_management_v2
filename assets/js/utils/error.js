import {MySwal} from "./MySwal";

/**
 * Display a MySwal popup to alert the user that a problem occured
 * @param error
 */
export function displayErrorPopup(error)
{
    console.log(error);
    MySwal.fire({icon:'error',title:'Erreur : ' + (error.message ?? error)});
}