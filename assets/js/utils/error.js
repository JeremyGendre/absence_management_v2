import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

/**
 * Display a MySwal popup to alert the user that a problem occured
 * @param error
 */
export function displayErrorPopup(error)
{
    MySwal.fire({icon:'error',title:'Erreur : ' + error.message});
}